import jwt from 'jsonwebtoken';
import { createVerify } from 'node:crypto';
import User from '../models/User.js';

let googleCertificates;
let googleCertificatesExpiresAt = 0;

async function verifyGoogleCredential(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const error = new Error('Google sign-in is not configured');
    error.status = 503;
    throw error;
  }

  const [encodedHeader, encodedPayload, signature] = String(idToken || '').split('.');
  if (!encodedHeader || !encodedPayload || !signature) {
    const error = new Error('Invalid Google credential');
    error.status = 401;
    throw error;
  }

  let header;
  let claims;
  try {
    header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
    claims = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    const error = new Error('Invalid Google credential');
    error.status = 401;
    throw error;
  }

  if (header.alg !== 'RS256' || !header.kid) {
    const error = new Error('Invalid Google credential');
    error.status = 401;
    throw error;
  }

  if (!googleCertificates || Date.now() >= googleCertificatesExpiresAt) {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!response.ok) throw new Error('Could not verify Google credential');
    googleCertificates = await response.json();
    const cacheControl = response.headers.get('cache-control') || '';
    const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 3600);
    googleCertificatesExpiresAt = Date.now() + maxAge * 1000;
  }

  const certificate = googleCertificates.keys?.find((key) => key.kid === header.kid);
  const signedContent = `${encodedHeader}.${encodedPayload}`;
  const verifier = createVerify('RSA-SHA256');
  verifier.update(signedContent);
  verifier.end();
  const validSignature = certificate?.x5c?.[0]
    ? verifier.verify(`-----BEGIN CERTIFICATE-----\n${certificate.x5c[0]}\n-----END CERTIFICATE-----`, Buffer.from(signature, 'base64url'))
    : false;
  const audienceMatches = claims.aud === clientId ||
    (Array.isArray(claims.aud) && claims.aud.includes(clientId));
  const issuerMatches = ['accounts.google.com', 'https://accounts.google.com'].includes(claims.iss);
  if (!validSignature || !audienceMatches || !issuerMatches || claims.exp <= Date.now() / 1000 ||
      !claims.sub || !claims.email || claims.email_verified !== true) {
    const error = new Error('Google sign-in could not be verified');
    error.status = 401;
    throw error;
  }

  return {
    googleId: claims.sub,
    email: claims.email.trim().toLowerCase(),
    name: claims.name?.trim() || claims.email.split('@')[0],
  };
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function createToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
  return res.status(201).json({ user: publicUser(user), token: createToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email?.trim() || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email or password is incorrect' });
  }

  return res.json({ user: publicUser(user), token: createToken(user) });
}

export async function googleLogin(req, res) {
  const profile = await verifyGoogleCredential(req.body?.credential);
  let user = await User.findOne({ googleId: profile.googleId });

  if (!user) {
    user = await User.findOne({ email: profile.email }).select('+googleId');
    if (user?.role === 'admin') {
      return res.status(403).json({ message: 'Google sign-in is only available for student accounts' });
    }
    if (user && user.googleId && user.googleId !== profile.googleId) {
      return res.status(409).json({ message: 'This email is linked to another Google account' });
    }
    if (user) {
      user.googleId = profile.googleId;
      await user.save();
    } else {
      try {
        user = await User.createGoogleStudent(profile);
      } catch (error) {
        if (error.code !== 11000) throw error;
        user = await User.findOne({ $or: [{ googleId: profile.googleId }, { email: profile.email }] });
        if (!user || user.role === 'admin' || (user.googleId && user.googleId !== profile.googleId)) throw error;
      }
    }
  }

  if (user.role !== 'student') {
    return res.status(403).json({ message: 'Google sign-in is only available for student accounts' });
  }
  return res.json({ user: publicUser(user), token: createToken(user) });
}

export function currentUser(req, res) {
  return res.json({ user: publicUser(req.user) });
}

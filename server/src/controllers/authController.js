import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

export function currentUser(req, res) {
  return res.json({ user: publicUser(req.user) });
}

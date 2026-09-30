import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Eye, EyeOff, GraduationCap } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import api, { getApiErrorMessage } from '../../utils/api.js';
import toast from 'react-hot-toast';

export default function AuthPage({
  mode,
  onNavigate,
  onAuth,
  adminOnly = false,
  theme,
  onToggleTheme,
}) {
  const [name, setName] = useState(''),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [submitting, setSubmitting] = useState(false),
    [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef(null);
  const login = mode === 'login';

  useEffect(() => {
    if (adminOnly) return undefined;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return undefined;

    let cancelled = false;
    const renderButton = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setSubmitting(true);
          try {
            const { data } = await api.post('/auth/google', { credential });
            onAuth({ ...data.user, token: data.token });
          } catch (requestError) {
            toast.error(getApiErrorMessage(requestError));
          } finally {
            setSubmitting(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: theme === 'dark' ? 'filled_black' : 'outline',
        size: 'large',
        shape: 'rectangular',
        text: login ? 'signin_with' : 'signup_with',
        width: Math.min(400, googleButtonRef.current.clientWidth || 400),
        locale: 'bn',
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
    } else {
      let script = document.querySelector('script[data-google-identity]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.dataset.googleIdentity = 'true';
        document.head.appendChild(script);
      }
      script.addEventListener('load', renderButton);
      return () => {
        cancelled = true;
        script.removeEventListener('load', renderButton);
      };
    }

    return () => { cancelled = true; };
  }, [adminOnly, login, onAuth, theme]);

  async function submit(event) {
    event.preventDefault();
    if (!login && password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = login ? '/auth/login' : '/auth/register';
      const payload = login
        ? { email: email.trim().toLowerCase(), password }
        : { name: name.trim(), email: email.trim().toLowerCase(), password };
      const { data } = await api.post(endpoint, payload);
      onAuth({ ...data.user, token: data.token });
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`auth-shell min-h-screen ${login || adminOnly ? 'auth-login' : 'auth-register'}`}>
      <div className="auth-art">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          <span className="brand-icon">
            <GraduationCap size={21} />
          </span>
          শিখাই
        </a>
        <div>
          <span className="eyebrow">শেখার নতুন শুরু</span>
          <h1>
            আপনার আগামী
            <br />
            দিন গড়ে উঠুক
            <br />
            <span>নতুন দক্ষতায়।</span>
          </h1>
          <p>শিখুন নিজের মতো করে। এগিয়ে যান নিজের লক্ষ্যে।</p>
        </div>
        <div className="auth-art-bottom">শিখাই · শেখার সহজ পথ</div>
      </div>
      <div className="auth-panel">
        <div className="auth-top-actions">
          <button className="back-home" onClick={() => onNavigate('/')}>
            ← হোমপেজে ফিরুন
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <div className="auth-form-wrap">
          <div className="auth-icon">
            <GraduationCap />
          </div>
          <span className="eyebrow">
            {adminOnly ? 'নিরাপদ অ্যাডমিন প্রবেশ' : 'স্বাগতম শিখাইয়ে'}
          </span>
          <h2>
            {adminOnly
              ? 'অ্যাডমিন লগইন'
              : login
                ? 'আবার ফিরে এলেন!'
                : 'অ্যাকাউন্ট তৈরি করুন'}
          </h2>
          <p>
            {adminOnly
              ? 'অ্যাডমিন প্যানেলে যেতে লগইন করুন।'
              : login
                ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন।'
                : 'আজই শেখার যাত্রা শুরু করুন।'}
          </p>
          <form onSubmit={submit}>
            {!login && !adminOnly && (
              <label>
                আপনার নাম
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="সম্পূর্ণ নাম"
                />
              </label>
            )}
            <label>
              ইমেইল
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল"
                autoComplete="email"
              />
            </label>
            <label>
              পাসওয়ার্ড
              <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                autoComplete={login ? 'current-password' : 'new-password'}
              />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button className="button button-primary auth-submit" disabled={submitting}>
              {login || adminOnly ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}{' '}
              <ArrowRight size={17} />
            </button>
          </form>
          {!adminOnly && (
            <div className="google-auth-divider">
              <span>অথবা Google দিয়ে</span>
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <div ref={googleButtonRef} />
              ) : (
                <button
                  className="google-auth-unconfigured"
                  type="button"
                  onClick={() => toast.error('Google sign-in চালু করতে VITE_GOOGLE_CLIENT_ID সেট করুন।')}
                >
                  <svg className="google-auth-logo" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.88c-.58 2.96-2.25 5.48-4.72 7.18l7.64 5.93c4.46-4.11 7.18-10.15 7.18-17.58Z" />
                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.64-5.93c-2.13 1.43-4.86 2.3-8.26 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                  </svg>
                  <span className="google-auth-copy">
                    <strong>{login ? 'Google দিয়ে লগইন করুন' : 'Google দিয়ে রেজিস্ট্রেশন করুন'}</strong>
                    <small>দ্রুত ও নিরাপদে চালিয়ে যান</small>
                  </span>
                  <ArrowRight className="google-auth-arrow" size={17} aria-hidden="true" />                </button>
              )}
            </div>
          )}
          <div className="auth-switch">
            {login ? 'অ্যাকাউন্ট নেই?' : 'আগে থেকেই অ্যাকাউন্ট আছে?'}{' '}
            <button onClick={() => onNavigate(login ? '/register' : '/login')}>
              {login ? 'রেজিস্ট্রেশন করুন' : 'লগইন করুন'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

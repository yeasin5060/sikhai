import React, { useState } from 'react';
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
  const login = mode === 'login';

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

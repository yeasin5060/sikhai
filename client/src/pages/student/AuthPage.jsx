import React, { useState } from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getAccounts, saveAccounts } from '../../utils/storage.js';
import ThemeToggle from '../../components/ThemeToggle.jsx';

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
    [error, setError] = useState('');
  const login = mode === 'login';
  function submit(e) {
    e.preventDefault();
    setError('');
    if (email.trim().toLowerCase() === 'admin@gmail.com' && password === 'admin123@') {
      onAuth({ name: 'অ্যাডমিন', email: 'admin@gmail.com', role: 'admin' });
      return;
    }
    if (login) {
      try {
        const saved = getAccounts().find(
          (u) => u.email === email.trim().toLowerCase() && u.password === password,
        );
        if (!saved) {
          setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
          return;
        }
        onAuth({ ...saved, role: 'student' });
      } catch {
        setError('আবার চেষ্টা করুন।');
      }
      return;
    }
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    const users = getAccounts();
    if (users.some((u) => u.email === email.trim().toLowerCase())) {
      setError('এই ইমেইল দিয়ে অ্যাকাউন্ট আছে। লগইন করুন।');
      return;
    }
    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };
    saveAccounts([...users, user]);
    onAuth({ ...user, role: 'student' });
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
          শিখাই<span className="brand-dot">.</span>
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
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                autoComplete={login ? 'current-password' : 'new-password'}
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="button button-primary auth-submit">
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
          <div className="demo-note">
            ডেমো সংস্করণ: অ্যাকাউন্টের তথ্য এই ব্রাউজারেই সংরক্ষিত হয়।
          </div>
        </div>
      </div>
    </div>
  );
}

import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'লাইট থিম চালু করুন' : 'ডার্ক থিম চালু করুন'}
      title={isDark ? 'লাইট থিম' : 'ডার্ক থিম'}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
      <span>{isDark ? 'লাইট' : 'ডার্ক'}</span>
    </button>
  );
}

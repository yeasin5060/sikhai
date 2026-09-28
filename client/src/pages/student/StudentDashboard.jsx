import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  Heart,
  LogOut,
  Search,
  Sparkles,
  Layers3,
} from 'lucide-react';
import { formatDigits, formatNumber, formatPrice } from '../../utils/formatters.js';
import { getStudentFavorites, saveStudentFavorites } from '../../utils/storage.js';
import ThemeToggle from '../../components/ThemeToggle.jsx';

export default function StudentDashboard({
  user,
  courses,
  enrolledIds,
  onBrowse,
  onNavigate,
  onEnroll,
  onLogout,
  theme,
  onToggleTheme,
}) {
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() => getStudentFavorites(user.email));
  const enrolledCourses = courses.filter((course) => enrolledIds.includes(course.id));
  const availableCourses = courses
    .filter((course) => !enrolledIds.includes(course.id))
    .slice(0, 3);
  const categories = new Set(enrolledCourses.map((course) => course.category)).size;
  const visibleCourses = useMemo(
    () =>
      enrolledCourses.filter((course) => {
        const matchesSearch = `${course.name} ${course.category}`
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesSearch && (!showFavorites || favorites.includes(course.id));
      }),
    [enrolledCourses, favorites, search, showFavorites],
  );

  const toggleFavorite = (courseId) => {
    const nextFavorites = favorites.includes(courseId)
      ? favorites.filter((id) => id !== courseId)
      : [...favorites, courseId];
    setFavorites(nextFavorites);
    saveStudentFavorites(user.email, nextFavorites);
  };

  return (
    <div className="student-dashboard">
      <header className="student-dashboard-header">
        <a
          className="brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onBrowse();
          }}
        >
          <span className="brand-icon">
            <GraduationCap size={21} />
          </span>
          শিখাই<span className="brand-dot">.</span>
        </a>
        <div className="student-dashboard-actions">
          <button className="button button-light" onClick={onBrowse}>
            <BookOpen size={16} /> সব কোর্স
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="button button-outline" onClick={onLogout}>
            <LogOut size={16} /> লগআউট
          </button>
        </div>
      </header>

      <main className="student-dashboard-content">
        <section className="student-hero-panel">
          <div className="student-hero-copy">
            <span className="student-kicker">
              <Sparkles size={15} /> তোমার শেখার জায়গা
            </span>
            <h1>স্বাগতম, {user.name}</h1>
            <p>{user.email} · নিজের গতিতে শিখুন, দক্ষতা গড়ুন।</p>
            <button className="button button-primary" onClick={onBrowse}>
              নতুন কোর্স খুঁজুন <ArrowRight size={17} />
            </button>
          </div>
          <div className="student-hero-art">
            <div className="student-hero-icon">
              <GraduationCap size={54} />
            </div>
            <span>
              আজকের শেখাই
              <br />
              আগামীর শক্তি
            </span>
          </div>
        </section>

        <section className="student-metrics" aria-label="শেখার সারসংক্ষেপ">
          <article className="student-metric">
            <span className="metric-icon metric-purple">
              <BookOpen size={19} />
            </span>
            <div>
              <small>আমার কোর্স</small>
              <strong className="number-display">
                {formatNumber(enrolledCourses.length)}
              </strong>
            </div>
          </article>
          <article className="student-metric">
            <span className="metric-icon metric-blue">
              <Layers3 size={19} />
            </span>
            <div>
              <small>বিভাগ</small>
              <strong className="number-display">{formatNumber(categories)}</strong>
            </div>
          </article>
          <article className="student-metric">
            <span className="metric-icon metric-pink">
              <Heart size={19} />
            </span>
            <div>
              <small>পছন্দের কোর্স</small>
              <strong className="number-display">{formatNumber(favorites.length)}</strong>
            </div>
          </article>
        </section>

        <section className="student-courses">
          <div className="student-section-heading">
            <div>
              <span className="eyebrow">চালিয়ে যান</span>
              <h2>আমার শেখার তালিকা</h2>
              <p>আপনার ভর্তি হওয়া কোর্সগুলো এক জায়গায়।</p>
            </div>
            <label className="student-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="কোর্স খুঁজুন"
              />
            </label>
          </div>
          <div className="student-course-filters">
            <button
              className={!showFavorites ? 'student-filter active' : 'student-filter'}
              onClick={() => setShowFavorites(false)}
            >
              সব কোর্স <span>{enrolledCourses.length}</span>
            </button>
            <button
              className={showFavorites ? 'student-filter active' : 'student-filter'}
              onClick={() => setShowFavorites(true)}
            >
              <Heart size={14} /> পছন্দের{' '}
              <span className="number-display">{formatNumber(favorites.length)}</span>
            </button>
          </div>
          {visibleCourses.length ? (
            <div className="student-course-grid">
              {visibleCourses.map((course) => (
                <article className="student-course-card" key={course.id}>
                  <div className="student-course-image">
                    <img src={course.image} alt={course.name} />
                    <span>{course.category}</span>
                    <button
                      className={
                        favorites.includes(course.id)
                          ? 'favorite-button active'
                          : 'favorite-button'
                      }
                      onClick={() => toggleFavorite(course.id)}
                      aria-label={
                        favorites.includes(course.id)
                          ? 'পছন্দ থেকে সরান'
                          : 'পছন্দে যোগ করুন'
                      }
                    >
                      <Heart
                        size={17}
                        fill={favorites.includes(course.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                  <div className="student-course-body">
                    <h3>{course.name}</h3>
                    <div className="student-course-meta">
                      <span>
                        <Clock3 size={14} /> {formatDigits(course.duration)}
                      </span>
                      <span>{formatPrice(course.onlinePrice)}</span>
                    </div>
                    <div className="student-course-actions">
                      <button
                        className="button button-primary"
                        onClick={() => onNavigate(`/courses/${course.id}`)}
                      >
                        কোর্স খুলুন <ArrowRight size={15} />
                      </button>
                      <span className="enrolled-badge">ভর্তি আছেন</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="student-empty">
              <BookOpen size={30} />
              <h3>
                {enrolledCourses.length
                  ? 'কোনো কোর্স পাওয়া যায়নি'
                  : 'এখনো কোনো কোর্সে ভর্তি হননি'}
              </h3>
              <p>
                {enrolledCourses.length
                  ? 'অন্য নামে খুঁজে দেখুন, অথবা সব কোর্স দেখুন।'
                  : 'কোর্স বেছে নিলে সেটি এখানে দেখা যাবে।'}
              </p>
              <button className="button button-primary" onClick={onBrowse}>
                কোর্স ব্রাউজ করুন
              </button>
            </div>
          )}
        </section>

        {!!availableCourses.length && (
          <section className="student-discover">
            <div className="student-section-heading">
              <div>
                <span className="eyebrow">আরও শিখুন</span>
                <h2>আপনার জন্য আরও কোর্স</h2>
                <p>নতুন কোনো দক্ষতা শেখা শুরু করুন।</p>
              </div>
              <button className="text-link" onClick={onBrowse}>
                সব কোর্স দেখুন <ArrowRight size={16} />
              </button>
            </div>
            <div className="student-suggestions">
              {availableCourses.map((course) => (
                <article className="student-suggestion" key={course.id}>
                  <img src={course.image} alt="" />
                  <div>
                    <span>{course.category}</span>
                    <h3>{course.name}</h3>
                    <small>{formatPrice(course.onlinePrice)}</small>
                  </div>
                  <button
                    className="suggestion-add"
                    onClick={() => onEnroll(course.id)}
                    aria-label={`${course.name} কোর্সে ভর্তি হন`}
                  >
                    <ArrowRight size={18} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

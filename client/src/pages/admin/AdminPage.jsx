import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
  X,
} from 'lucide-react';
import CourseTable from './CourseTable.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';

export default function AdminPage({
  user,
  courses,
  setCourses,
  onLogout,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [tab, setTab] = useState('overview'),
    [showForm, setShowForm] = useState(false),
    [form, setForm] = useState({
      name: '',
      category: 'ডেভেলপমেন্ট',
      onlinePrice: '',
      offlinePrice: '',
      duration: '৩ মাস',
      students: '০',
      description: '',
      image: '',
    }),
    [notice, setNotice] = useState('');
  const set = (k, v) => setForm({ ...form, [k]: v });
  function addCourse(e) {
    e.preventDefault();
    setCourses([
      {
        ...form,
        id: Date.now(),
        onlinePrice: Number(form.onlinePrice),
        offlinePrice: Number(form.offlinePrice),
        students: Number(form.students) || 0,
        image:
          form.image ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      },
      ...courses,
    ]);
    setForm({
      name: '',
      category: 'ডেভেলপমেন্ট',
      onlinePrice: '',
      offlinePrice: '',
      duration: '৩ মাস',
      students: '০',
      description: '',
      image: '',
    });
    setShowForm(false);
    setNotice('নতুন কোর্স প্রকাশ করা হয়েছে।');
    setTimeout(() => setNotice(''), 2500);
  }
  return (
    <div className="admin-layout min-h-screen">
      <aside className="admin-sidebar">
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
        <div className="admin-label">অ্যাডমিন মেনু</div>
        <button
          className={tab === 'overview' ? 'side-link selected' : 'side-link'}
          onClick={() => setTab('overview')}
        >
          <LayoutDashboard size={18} /> ড্যাশবোর্ড
        </button>
        <button
          className={tab === 'courses' ? 'side-link selected' : 'side-link'}
          onClick={() => setTab('courses')}
        >
          <BookOpen size={18} /> কোর্সসমূহ <span>{courses.length}</span>
        </button>
        <div className="sidebar-bottom">
          <div className="admin-profile">
            <span className="profile-avatar">অ</span>
            <div>
              <b>{user.name}</b>
              <small>অ্যাডমিন</small>
            </div>
          </div>
          <button className="side-link" onClick={() => onNavigate('/')}>
            <ArrowRight size={17} /> ওয়েবসাইট দেখুন
          </button>
          <button className="side-link signout" onClick={onLogout}>
            <LogOut size={17} /> লগআউট
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-top">
          <div>
            <span className="breadcrumb">
              শিখাই <ChevronRight size={14} /> অ্যাডমিন
            </span>
            <h1>{tab === 'overview' ? 'ড্যাশবোর্ড' : 'কোর্স ব্যবস্থাপনা'}</h1>
          </div>
          <div className="admin-top-right">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <span className="status-live">
              <i /> সাইট সচল
            </span>
            <span className="admin-top-avatar">অ</span>
          </div>
        </header>
        <div className="admin-content">
          {tab === 'overview' ? (
            <>
              <div className="welcome-row">
                <div>
                  <h2>স্বাগতম, {user.name} 👋</h2>
                  <p>শিখাই প্ল্যাটফর্মের আজকের সারসংক্ষেপ।</p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => {
                    setTab('courses');
                    setShowForm(true);
                  }}
                >
                  <Plus size={17} /> নতুন কোর্স যোগ করুন
                </button>
              </div>
              <div className="admin-stats">
                <div className="admin-stat">
                  <span className="stat-symbol purple">
                    <BookOpen />
                  </span>
                  <small>মোট কোর্স</small>
                  <b>{courses.length.toLocaleString('bn-BD')}</b>
                  <span className="stat-foot">প্রকাশিত কোর্স</span>
                </div>
                <div className="admin-stat">
                  <span className="stat-symbol blue">
                    <Users />
                  </span>
                  <small>মোট শিক্ষার্থী</small>
                  <b>
                    {courses
                      .reduce((a, c) => a + Number(c.students || 0), 0)
                      .toLocaleString('bn-BD')}
                    +
                  </b>
                  <span className="stat-foot">কোর্সে নিবন্ধিত</span>
                </div>
                <div className="admin-stat">
                  <span className="stat-symbol orange">
                    <GraduationCap />
                  </span>
                  <small>কোর্স বিভাগ</small>
                  <b>
                    {new Set(courses.map((c) => c.category)).size.toLocaleString('bn-BD')}
                  </b>
                  <span className="stat-foot">বিভিন্ন দক্ষতা</span>
                </div>
              </div>
              <section className="admin-table-card">
                <div className="table-heading">
                  <div>
                    <h3>সাম্প্রতিক কোর্স</h3>
                    <p>আপনার কোর্সগুলো পরিচালনা করুন</p>
                  </div>
                  <button
                    className="button button-light"
                    onClick={() => setTab('courses')}
                  >
                    সব কোর্স <ArrowRight size={15} />
                  </button>
                </div>
                <CourseTable
                  courses={courses.slice(0, 5)}
                  onDelete={(id) => setCourses(courses.filter((c) => c.id !== id))}
                />
              </section>
            </>
          ) : (
            <section className="admin-table-card course-manager">
              <div className="table-heading">
                <div>
                  <h3>
                    সকল কোর্স{' '}
                    <span className="count-pill">
                      {courses.length.toLocaleString('bn-BD')}
                    </span>
                  </h3>
                  <p>কোর্স যোগ, দেখুন অথবা সরিয়ে ফেলুন</p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? <X size={17} /> : <Plus size={17} />}{' '}
                  {showForm ? 'বন্ধ করুন' : 'নতুন কোর্স'}
                </button>
              </div>
              {showForm && (
                <form className="add-course-form" onSubmit={addCourse}>
                  <h3>নতুন কোর্স প্রকাশ করুন</h3>
                  <div className="form-grid">
                    <label>
                      কোর্সের নাম
                      <input
                        required
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="যেমন: ওয়েব ডেভেলপমেন্ট"
                      />
                    </label>
                    <label>
                      বিভাগ
                      <select
                        value={form.category}
                        onChange={(e) => set('category', e.target.value)}
                      >
                        {[
                          'ডেভেলপমেন্ট',
                          'ডিজাইন',
                          'মার্কেটিং',
                          'ভাষা',
                          'ম্যানেজমেন্ট',
                          'দক্ষতা',
                        ].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      অনলাইন মূল্য (টাকা)
                      <input
                        type="number"
                        min="0"
                        required
                        value={form.onlinePrice}
                        onChange={(e) => set('onlinePrice', e.target.value)}
                        placeholder="৪০০০"
                      />
                    </label>
                    <label>
                      অফলাইন মূল্য (টাকা)
                      <input
                        type="number"
                        min="0"
                        required
                        value={form.offlinePrice}
                        onChange={(e) => set('offlinePrice', e.target.value)}
                        placeholder="৭০০০"
                      />
                    </label>
                    <label>
                      কোর্সের সময়কাল
                      <input
                        required
                        value={form.duration}
                        onChange={(e) => set('duration', e.target.value)}
                        placeholder="৩ মাস"
                      />
                    </label>
                    <label>
                      শিক্ষার্থীর সংখ্যা
                      <input
                        type="number"
                        min="0"
                        value={form.students}
                        onChange={(e) => set('students', e.target.value)}
                      />
                    </label>
                    <label className="form-wide">
                      ছবির লিংক
                      <input
                        type="url"
                        value={form.image}
                        onChange={(e) => set('image', e.target.value)}
                        placeholder="https://..."
                      />
                    </label>
                    <label className="form-wide">
                      কোর্সের বিবরণ
                      <textarea
                        required
                        rows="3"
                        value={form.description}
                        onChange={(e) => set('description', e.target.value)}
                        placeholder="কোর্সে কী শিখবেন লিখুন"
                      />
                    </label>
                  </div>
                  <button className="button button-primary">
                    <Check size={17} /> কোর্স প্রকাশ করুন
                  </button>
                </form>
              )}
              <CourseTable
                courses={courses}
                onDelete={(id) => setCourses(courses.filter((c) => c.id !== id))}
              />
            </section>
          )}
        </div>
      </main>
      {notice && (
        <div className="toast">
          <Check size={17} />
          {notice}
        </div>
      )}
    </div>
  );
}

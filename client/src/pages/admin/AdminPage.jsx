import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesColumn,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRoundCog,
  Users,
  X,
} from 'lucide-react';
import CourseTable from './CourseTable.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import StudentManagement from './StudentManagement.jsx';
import AnalyticsPage from './AnalyticsPage.jsx';
import EnrollmentManagement from './EnrollmentManagement.jsx';
import CourseForm, { createEmptyCourseForm } from './CourseForm.jsx';
import { formatNumber } from '../../utils/formatters.js';

const tabTitles = {
  overview: 'ড্যাশবোর্ড',
  courses: 'কোর্স ব্যবস্থাপনা',
  students: 'শিক্ষার্থী',
  enrollments: 'ভর্তি তালিকা',
  profile: 'অ্যাডমিন প্রোফাইল',
  analytics: 'পরিসংখ্যান',
};

export default function AdminPage({
  user,
  courses,
  setCourses,
  accounts = [],
  enrollments = {},
  onProfileUpdate,
  onLogout,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(createEmptyCourseForm);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
  });
  const [notice, setNotice] = useState('');

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const resetCourseForm = () => {
    setForm(createEmptyCourseForm());
    setEditingCourseId(null);
  };
  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2500);
  };

  const editCourse = (course) => {
    setTab('courses');
    setShowForm(true);
    setEditingCourseId(course.id);
    setForm({
      ...createEmptyCourseForm(),
      ...course,
      onlinePrice: String(course.onlinePrice ?? ''),
      offlinePrice: String(course.offlinePrice ?? ''),
      students: String(course.students ?? 0),
      instructor: course.instructor || '',
      level: course.level || '',
      prerequisites: course.prerequisites || '',
      learningOutcomes: Array.isArray(course.learningOutcomes)
        ? course.learningOutcomes.join('\n')
        : '',
      curriculum: Array.isArray(course.curriculum) ? course.curriculum.join('\n') : '',
    });
  };

  const saveCourse = (event) => {
    event.preventDefault();
    const previous = courses.find((course) => course.id === editingCourseId);
    const courseData = {
      ...form,
      id: editingCourseId ?? Date.now(),
      onlinePrice: Number(form.onlinePrice),
      offlinePrice: Number(form.offlinePrice),
      students: Number(form.students) || 0,
      learningOutcomes: form.learningOutcomes
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      curriculum: form.curriculum
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      image:
        form.image ||
        previous?.image ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    };
    const wasEditing = editingCourseId !== null;
    setCourses(
      wasEditing
        ? courses.map((course) => (course.id === editingCourseId ? courseData : course))
        : [courseData, ...courses],
    );
    resetCourseForm();
    setShowForm(false);
    showNotice(
      wasEditing ? 'কোর্সের তথ্য হালনাগাদ হয়েছে।' : 'নতুন কোর্স প্রকাশিত হয়েছে।',
    );
  };

  const enrollmentCount = Object.values(enrollments).reduce(
    (total, ids) => total + ids.length,
    0,
  );
  const tabs = [
    ['overview', <LayoutDashboard size={18} />, 'ড্যাশবোর্ড'],
    ['courses', <BookOpen size={18} />, 'কোর্সসমূহ', courses.length],
    ['students', <Users size={18} />, 'শিক্ষার্থী', accounts.length],
    ['enrollments', <ClipboardList size={18} />, 'ভর্তি', enrollmentCount],
    ['analytics', <ChartNoAxesColumn size={18} />, 'পরিসংখ্যান'],
    ['profile', <UserRoundCog size={18} />, 'প্রোফাইল'],
  ];

  return (
    <div className="admin-layout min-h-screen">
      <aside className="admin-sidebar">
        <a
          className="brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('/');
          }}
        >
          <span className="brand-icon">
            <GraduationCap size={21} />
          </span>
          শিখাই<span className="brand-dot">.</span>
        </a>
        <div className="admin-label">অ্যাডমিন মেনু</div>
        {tabs.map(([id, icon, label, count]) => (
          <button
            className={tab === id ? 'side-link selected' : 'side-link'}
            onClick={() => setTab(id)}
            key={id}
          >
            {icon} {label}
            {count !== undefined && (
              <span className="number-display">{formatNumber(count)}</span>
            )}
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="admin-profile">
            <span className="profile-avatar">অ</span>
            <div>
              <b>{user.name}</b>
              <small>অ্যাডমিন</small>
            </div>
          </div>
          <button className="side-link" onClick={() => onNavigate('/')}>
            <ArrowRight size={17} /> ওয়েবসাইট দেখুন
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
            <h1>{tabTitles[tab]}</h1>
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
          {tab === 'overview' && (
            <>
              <div className="welcome-row">
                <div>
                  <h2>স্বাগতম, {user.name} 👋</h2>
                  <p>আপনার শেখাই প্ল্যাটফর্মের সারসংক্ষেপ।</p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => {
                    resetCourseForm();
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
                  <b className="number-display">{formatNumber(courses.length)}</b>
                  <span className="stat-foot">প্রকাশিত কোর্স</span>
                </div>
                <div className="admin-stat">
                  <span className="stat-symbol blue">
                    <Users />
                  </span>
                  <small>শিক্ষার্থী</small>
                  <b className="number-display">{formatNumber(accounts.length)}</b>
                  <span className="stat-foot">নিবন্ধিত অ্যাকাউন্ট</span>
                </div>
                <div className="admin-stat">
                  <span className="stat-symbol orange">
                    <GraduationCap />
                  </span>
                  <small>কোর্সে ভর্তি</small>
                  <b className="number-display">{formatNumber(enrollmentCount)}</b>
                  <span className="stat-foot">মোট ভর্তি</span>
                </div>
              </div>
              <section className="admin-table-card">
                <div className="table-heading">
                  <div>
                    <h3>সাম্প্রতিক কোর্স</h3>
                    <p>প্রকাশিত কোর্সগুলো পরিচালনা করুন</p>
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
                  onEdit={editCourse}
                  onDelete={(id) =>
                    setCourses(courses.filter((course) => course.id !== id))
                  }
                />
              </section>
            </>
          )}

          {tab === 'courses' && (
            <section className="admin-table-card course-manager">
              <div className="table-heading">
                <div>
                  <h3>
                    সকল কোর্স{' '}
                    <span className="count-pill number-display">
                      {formatNumber(courses.length)}
                    </span>
                  </h3>
                  <p>কোর্স যোগ, সম্পাদনা অথবা মুছে ফেলুন</p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => {
                    if (showForm) {
                      resetCourseForm();
                      setShowForm(false);
                    } else {
                      resetCourseForm();
                      setShowForm(true);
                    }
                  }}
                >
                  {showForm ? <X size={17} /> : <Plus size={17} />}{' '}
                  {showForm ? 'বন্ধ করুন' : 'নতুন কোর্স'}
                </button>
              </div>
              {showForm && (
                <CourseForm
                  form={form}
                  courses={courses}
                  isEditing={editingCourseId !== null}
                  onFieldChange={setField}
                  onSubmit={saveCourse}
                />
              )}
              <CourseTable
                courses={courses}
                onEdit={editCourse}
                onDelete={(id) =>
                  setCourses(courses.filter((course) => course.id !== id))
                }
              />
            </section>
          )}

          {tab === 'students' && (
            <StudentManagement
              accounts={accounts}
              enrollments={enrollments}
              courses={courses}
            />
          )}
          {tab === 'enrollments' && (
            <EnrollmentManagement
              accounts={accounts}
              enrollments={enrollments}
              courses={courses}
            />
          )}
          {tab === 'analytics' && (
            <AnalyticsPage courses={courses} enrollments={enrollments} />
          )}
          {tab === 'profile' && (
            <section className="admin-table-card admin-profile-settings">
              <div className="table-heading">
                <div>
                  <h3>অ্যাডমিন প্রোফাইল</h3>
                  <p>আপনার নাম ও ফোন নম্বর হালনাগাদ করুন।</p>
                </div>
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onProfileUpdate(profileForm);
                  showNotice('প্রোফাইল হালনাগাদ হয়েছে।');
                }}
              >
                <label>
                  নাম
                  <input
                    required
                    value={profileForm.name}
                    onChange={(event) =>
                      setProfileForm({ ...profileForm, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  লগইন ইমেইল
                  <input value={user.email} readOnly />
                </label>
                <label>
                  ফোন নম্বর
                  <input
                    value={profileForm.phone}
                    onChange={(event) =>
                      setProfileForm({ ...profileForm, phone: event.target.value })
                    }
                    placeholder="ফোন নম্বর (ঐচ্ছিক)"
                  />
                </label>
                <button className="button button-primary">
                  <Check size={16} /> প্রোফাইল সংরক্ষণ করুন
                </button>
              </form>
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

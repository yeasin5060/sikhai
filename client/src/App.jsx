import { useEffect, useMemo, useState } from 'react';
import AdminPage from './pages/admin/AdminPage.jsx';
import AuthPage from './pages/student/AuthPage.jsx';
import StudentHome from './pages/student/StudentHome.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import CourseDetails from './pages/student/CourseDetails.jsx';
import { starterCourses } from './data/courses.js';
import {
  clearUser,
  getAccounts,
  getAdminProfile,
  getAllStudentEnrollments,
  getSavedCourses,
  getSavedUser,
  getStudentEnrollments,
  saveCourses,
  saveAdminProfile,
  saveUser,
  saveStudentEnrollments,
} from './utils/storage.js';

function getInitialTheme() {
  const savedTheme = localStorage.getItem('sikhai_theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  return savedTheme;
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(getSavedUser);
  const [courses, setCourses] = useState(() => getSavedCourses(starterCourses));
  const [enrolledIds, setEnrolledIds] = useState(() =>
    getStudentEnrollments(getSavedUser()?.email),
  );
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('সব');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('sikhai_theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
    setMobileNav(false);
    if (window.lenis) window.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const logout = () => {
    clearUser();
    setUser(null);
    navigate('/');
  };

  const handleAuth = (authenticatedUser, redirectTo) => {
    const profile = authenticatedUser.role === 'admin' ? getAdminProfile() : {};
    const signedInUser = { ...authenticatedUser, ...profile };
    setUser(signedInUser);
    saveUser(signedInUser);
    setEnrolledIds(getStudentEnrollments(signedInUser.email));
    navigate(redirectTo);
  };

  const updateAdminProfile = (profile) => {
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    saveUser(updatedUser);
    saveAdminProfile(profile);
  };

  const enrollInCourse = (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (enrolledIds.includes(courseId)) return;
    const nextIds = [...enrolledIds, courseId];
    setEnrolledIds(nextIds);
    saveStudentEnrollments(user.email, nextIds);
    notify('কোর্সটি আপনার ড্যাশবোর্ডে যোগ হয়েছে।');
  };

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesCategory = category === 'সব' || course.category === category;
        const searchableText = `${course.name} ${course.description}`;
        return (
          matchesCategory && searchableText.toLowerCase().includes(query.toLowerCase())
        );
      }),
    [category, courses, query],
  );

  const isAdmin = user?.role === 'admin';

  if (path === '/login' || path === '/register') {
    return (
      <AuthPage
        mode={path.slice(1)}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        onAuth={(authenticatedUser) =>
          handleAuth(
            authenticatedUser,
            authenticatedUser.role === 'admin' ? '/admin' : '/',
          )
        }
      />
    );
  }

  if (path.startsWith('/admin')) {
    if (!isAdmin) {
      return (
        <AuthPage
          mode="login"
          adminOnly
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          onAuth={(authenticatedUser) => handleAuth(authenticatedUser, '/admin')}
        />
      );
    }

    return (
      <AdminPage
        user={user}
        courses={courses}
        setCourses={setCourses}
        accounts={getAccounts()}
        enrollments={getAllStudentEnrollments()}
        onProfileUpdate={updateAdminProfile}
        onLogout={logout}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (path === '/dashboard') {
    if (!user) {
      return (
        <AuthPage
          mode="login"
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          onAuth={(authenticatedUser) =>
            handleAuth(
              authenticatedUser,
              authenticatedUser.role === 'admin' ? '/admin' : '/dashboard',
            )
          }
        />
      );
    }
    if (isAdmin)
      return (
        <AdminPage
          user={user}
          courses={courses}
          setCourses={setCourses}
          accounts={getAccounts()}
          enrollments={getAllStudentEnrollments()}
          onProfileUpdate={updateAdminProfile}
          onLogout={logout}
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    return (
      <StudentDashboard
        user={user}
        courses={courses}
        enrolledIds={enrolledIds}
        onBrowse={() => navigate('/')}
        onNavigate={navigate}
        onEnroll={enrollInCourse}
        onLogout={logout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  const courseDetailMatch = path.match(/^\/courses\/([^/]+)$/);
  if (courseDetailMatch) {
    const course = courses.find((item) => String(item.id) === courseDetailMatch[1]);
    if (course)
      return (
        <CourseDetails
          course={course}
          allCourses={courses}
          user={user}
          enrolledIds={enrolledIds}
          onNavigate={navigate}
          onEnroll={enrollInCourse}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
  }

  return (
    <StudentHome
      user={user}
      onNavigate={navigate}
      enrolledIds={enrolledIds}
      onEnroll={enrollInCourse}
      isAdmin={isAdmin}
      navigate={navigate}
      logout={logout}
      courses={courses}
      filteredCourses={filteredCourses}
      category={category}
      setCategory={setCategory}
      query={query}
      setQuery={setQuery}
      mobileNav={mobileNav}
      setMobileNav={setMobileNav}
      notify={notify}
      toast={toast}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;

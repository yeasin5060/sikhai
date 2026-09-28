import { useEffect, useMemo, useState } from 'react';
import AdminPage from './pages/admin/AdminPage.jsx';
import AuthPage from './pages/student/AuthPage.jsx';
import StudentHome from './pages/student/StudentHome.jsx';
import { starterCourses } from './data/courses.js';
import {
  clearUser,
  getSavedCourses,
  getSavedUser,
  saveCourses,
  saveUser,
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setUser(authenticatedUser);
    saveUser(authenticatedUser);
    navigate(redirectTo);
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
        onLogout={logout}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <StudentHome
      user={user}
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

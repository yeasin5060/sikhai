import { useEffect, useMemo, useState } from 'react';
import api, { getApiErrorMessage } from './utils/api.js';
import toast from 'react-hot-toast';
import AdminPage from './pages/admin/AdminPage.jsx';
import AuthPage from './pages/student/AuthPage.jsx';
import StudentHome from './pages/student/StudentHome.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import CourseDetails from './pages/student/CourseDetails.jsx';
import {
  clearUser,
  getAuthToken,
  getAdminProfile,
  saveAuthToken,
  saveAdminProfile,
} from './utils/storage.js';

function getInitialTheme() {
  const savedTheme = localStorage.getItem('sikhai_theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  return savedTheme;
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [enrollmentProofs, setEnrollmentProofs] = useState([]);
  const [authReady, setAuthReady] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('সব');
  const [mobileNav, setMobileNav] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const notify = (message, type = 'success') =>
    type === 'error' ? toast.error(message) : toast.success(message);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('sikhai_theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    let active = true;
    api.get('/courses')
      .then(({ data }) => {
        if (active) setCourses(data.courses);
      })
      .catch((error) => {
        if (active) notify(getApiErrorMessage(error, 'Could not load courses.'), 'error');
      });

    if (!getAuthToken()) {
      setAuthReady(true);
    } else {
      api.get('/auth/me')
        .then(({ data }) => {
          if (!active) return;
          const profile = data.user.role === 'admin' ? getAdminProfile() : {};
          setUser({ ...data.user, ...profile });
        })
        .catch(() => {
          clearUser();
        })
        .finally(() => {
          if (active) setAuthReady(true);
        });
    }

    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => {
      active = false;
      window.removeEventListener('popstate', syncPath);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setEnrolledIds([]);
      setAccounts([]);
      setEnrollments({});
      return undefined;
    }

    let active = true;
    api.get('/enrollments/me')
      .then(({ data }) => {
        if (active) {
          setEnrolledIds(data.enrollments.map(({ course }) => String(course.id)));
        }
      })
      .catch((error) => {
        if (active) notify(getApiErrorMessage(error, 'Could not load enrollments.'), 'error');
      });

    if (user.role === 'admin') {
      Promise.all([api.get('/admin/students'), api.get('/admin/enrollments')])
        .then(([studentsResponse, enrollmentsResponse]) => {
          if (!active) return;
          setAccounts(studentsResponse.data.students);
          setEnrollmentProofs(enrollmentsResponse.data.enrollments);
          const byEmail = {};
          enrollmentsResponse.data.enrollments.forEach(({ student, course }) => {
            if (!student?.email || !course?.id) return;
            const email = student.email.toLowerCase();
            byEmail[email] ||= [];
            byEmail[email].push(String(course.id));
          });
          setEnrollments(byEmail);
        })
        .catch((error) => {
          if (active) notify(getApiErrorMessage(error, 'Could not load admin data.'), 'error');
        });
    }

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    const match = path.match(/^\/courses\/([^/]+)$/);
    if (!match) return undefined;

    let active = true;
    api.get('/courses/' + encodeURIComponent(match[1]))
      .then(({ data }) => {
        if (!active) return;
        setCourses((currentCourses) => {
          const exists = currentCourses.some((course) => String(course.id) === String(data.course.id));
          return exists
            ? currentCourses.map((course) =>
                String(course.id) === String(data.course.id) ? data.course : course,
              )
            : [data.course, ...currentCourses];
        });
      })
      .catch((error) => {
        if (active) notify(getApiErrorMessage(error, 'Could not load this course.'), 'error');
      });
    return () => {
      active = false;
    };
  }, [path]);

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
    setMobileNav(false);
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const logout = () => {
    clearUser();
    setUser(null);
    navigate('/');
  };

  const handleAuth = (authenticatedUser, redirectTo) => {
    const { token, ...serverUser } = authenticatedUser;
    saveAuthToken(token);
    const profile = serverUser.role === 'admin' ? getAdminProfile() : {};
    setUser({ ...serverUser, ...profile });
    navigate(redirectTo);
  };

  const updateAdminProfile = (profile) => {
    setUser((currentUser) => ({ ...currentUser, ...profile }));
    saveAdminProfile(profile);
  };

  const enrollInCourse = async (courseId, deliveryMode = 'online', paymentDetails = {}) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const id = String(courseId);
    if (enrolledIds.includes(id)) return;
    try {
      await api.post('/enrollments/' + id, { deliveryMode, ...paymentDetails });
      setEnrolledIds((currentIds) => [...new Set([...currentIds, id])]);
      notify('Enrolled in course successfully.');
    } catch (error) {
      notify(getApiErrorMessage(error, 'Could not enroll in course.'), 'error');
    }
  };

  const cancelEnrollment = async (courseId) => {
    const id = String(courseId);
    try {
      await api.delete('/enrollments/' + id);
      setEnrolledIds((currentIds) => currentIds.filter((enrolledId) => enrolledId !== id));
      notify('Enrollment cancelled.');
    } catch (error) {
      notify(getApiErrorMessage(error, 'Could not cancel enrollment.'), 'error');
    }
  };

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesCategory = category === 'সব' || course.category === category;
        const searchableText = course.name + ' ' + course.description;
        return matchesCategory && searchableText.toLowerCase().includes(query.toLowerCase());
      }),
    [category, courses, query],
  );

  const isAdmin = user?.role === 'admin';

  if (!authReady) {
    return <div className="app-loading">Loading Shikhai...</div>;
  }

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
        accounts={accounts}
        enrollments={enrollments}
        enrollmentProofs={enrollmentProofs}
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
          accounts={accounts}
          enrollments={enrollments}
          enrollmentProofs={enrollmentProofs}
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
        onUnenroll={cancelEnrollment}
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
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;

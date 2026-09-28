const STORAGE_KEYS = {
  accounts: 'sikhai_accounts',
  courses: 'sikhai_courses',
  user: 'sikhai_user',
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export const getAccounts = () => readJson(STORAGE_KEYS.accounts, []);
export const getSavedUser = () => readJson(STORAGE_KEYS.user, null);
export const getSavedCourses = (fallback) => readJson(STORAGE_KEYS.courses, fallback);
export const getStudentEnrollments = (email) =>
  readJson('sikhai_enrollments', {})[email?.toLowerCase()] || [];
export const getAllStudentEnrollments = () => readJson('sikhai_enrollments', {});
export const getStudentFavorites = (email) =>
  readJson('sikhai_favorites', {})[email?.toLowerCase()] || [];
export const saveStudentFavorites = (email, courseIds) => {
  const favorites = readJson('sikhai_favorites', {});
  favorites[email.toLowerCase()] = courseIds;
  localStorage.setItem('sikhai_favorites', JSON.stringify(favorites));
};
export const saveStudentEnrollments = (email, courseIds) => {
  const enrollments = readJson('sikhai_enrollments', {});
  enrollments[email.toLowerCase()] = courseIds;
  localStorage.setItem('sikhai_enrollments', JSON.stringify(enrollments));
};

export const saveAccounts = (accounts) =>
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
export const saveUser = (user) =>
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
export const clearUser = () => localStorage.removeItem(STORAGE_KEYS.user);
export const saveCourses = (courses) =>
  localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));

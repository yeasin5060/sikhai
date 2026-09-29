import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const configuredForLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(
  configuredApiUrl || '',
);
const apiBaseUrl = import.meta.env.DEV
  ? configuredApiUrl || 'http://localhost:5000/api'
  : configuredForLocalhost
    ? undefined
    : configuredApiUrl;
const apiConfigError = configuredForLocalhost
  ? 'VITE_API_URL points to localhost. Set it to your deployed backend URL and redeploy.'
  : 'Set VITE_API_URL in the Vercel project and redeploy the frontend.';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

if (!apiBaseUrl) {
  api.interceptors.request.use(() =>
    Promise.reject(new Error(apiConfigError)),
  );
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sikhai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiErrorMessage(error, fallback = 'Request failed. Please try again.') {
  if (error.response?.data?.message) return error.response.data.message;
  if (!error.response) {
    return (
      error.message ||
      'Cannot reach the API. Check VITE_API_URL and the backend deployment.'
    );
  }
  return fallback;
}

export default api;

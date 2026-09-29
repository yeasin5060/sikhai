import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : undefined);

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

if (!apiBaseUrl) {
  api.interceptors.request.use(() =>
    Promise.reject(
      new Error('Set VITE_API_URL in the Vercel project and redeploy the frontend.'),
    ),
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

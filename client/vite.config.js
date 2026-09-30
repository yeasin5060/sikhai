import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const authHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
};

export default defineConfig({
  plugins: [react()],
  server: { headers: authHeaders },
  preview: { headers: authHeaders },
});

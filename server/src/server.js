import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import connectDB from './db/connectDB.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (
  process.env.CLIENT_ORIGIN ||
  'http://localhost:5173,https://sikhai-black.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      const error = new Error('Origin is not allowed by CORS');
      error.status = 403;
      return callback(error);
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'sikhai-api' });
});
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'sikhai-api' });
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use(notFound);
app.use(errorHandler);

let databaseConnection;

export default async function handler(req, res) {
  try {
    databaseConnection ||= connectDB();
    await databaseConnection;
    return app(req, res);
  } catch (error) {
    databaseConnection = undefined;
    console.error('Failed to connect to MongoDB:', error.message);
    return res.status(500).json({ message: 'Database connection failed' });
  }
}

if (process.env.VERCEL !== '1') {
  databaseConnection = connectDB();
  databaseConnection
    .then(() => {
      app.listen(port, () => {
        console.log(`Shikhai API listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start API:', error.message);
      process.exit(1);
    });
}

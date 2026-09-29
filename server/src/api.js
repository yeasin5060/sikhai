import 'dotenv/config';
import app from './app.js';
import connectDB from './db/connectDB.js';

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

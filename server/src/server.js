import 'dotenv/config';
import app from './app.js';
import connectDB from './db/connectDB.js';

const port = Number(process.env.PORT) || 5000;

try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Shikhai API listening on port ${port}`);
  });
} catch (error) {
  console.error('Failed to start API:', error.message);
  process.exit(1);
}

import 'dotenv/config';
import mongoose from 'mongoose';
import { starterCourses } from '../../../client/src/data/courses.js';
import Course from '../models/Course.js';

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');

try {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const { id: _oldId, ...course } of starterCourses) {
    await Course.updateOne(
      { name: course.name },
      { $setOnInsert: course },
      { upsert: true, runValidators: true },
    );
  }
  console.log(`Seeded ${starterCourses.length} starter courses where missing`);
} finally {
  await mongoose.disconnect();
}

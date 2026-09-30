import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

async function includeEnrollmentCounts(courses) {
  const courseIds = courses.map((course) => course._id);
  if (!courseIds.length) return [];

  const enrollmentCounts = await Enrollment.aggregate([
    { $match: { course: { $in: courseIds } } },
    { $group: { _id: '$course', count: { $sum: 1 } } },
  ]);
  const countsByCourse = new Map(
    enrollmentCounts.map(({ _id, count }) => [String(_id), count]),
  );

  return courses.map((course) => ({
    ...course.toJSON(),
    students: countsByCourse.get(String(course._id)) || 0,
  }));
}

export async function listCourses(req, res) {
  const filter = req.user?.role === 'admin' ? {} : { published: true };
  const courses = await Course.find(filter).sort({ createdAt: -1 });
  return res.json({ courses: await includeEnrollmentCounts(courses) });
}

export async function getCourse(req, res) {
  const filter = { _id: req.params.id };
  if (req.user?.role !== 'admin') filter.published = true;
  const course = await Course.findOne(filter);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const [courseWithCount] = await includeEnrollmentCounts([course]);
  return res.json({ course: courseWithCount });
}

export async function createCourse(req, res) {
  const course = await Course.create(req.body);
  const [courseWithCount] = await includeEnrollmentCounts([course]);
  return res.status(201).json({ course: courseWithCount });
}

export async function updateCourse(req, res) {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const [courseWithCount] = await includeEnrollmentCounts([course]);
  return res.json({ course: courseWithCount });
}

export async function deleteCourse(req, res) {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  await Enrollment.deleteMany({ course: course._id });
  return res.status(204).end();
}

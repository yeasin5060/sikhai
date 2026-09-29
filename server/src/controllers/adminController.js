import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';

export async function listStudents(_req, res) {
  const [students, records] = await Promise.all([
    User.find({ role: 'student' }).select('name email createdAt').sort({ createdAt: -1 }).lean(),
    Enrollment.find().select('student course').lean(),
  ]);
  const courseIdsByStudent = new Map();
  records.forEach(({ student, course }) => {
    const studentId = String(student);
    const courseIds = courseIdsByStudent.get(studentId) || [];
    courseIds.push(String(course));
    courseIdsByStudent.set(studentId, courseIds);
  });

  return res.json({
    students: students.map((student) => ({
      id: String(student._id),
      name: student.name,
      email: student.email,
      courseIds: courseIdsByStudent.get(String(student._id)) || [],
      createdAt: student.createdAt,
    })),
  });
}

export async function listAllEnrollments(_req, res) {
  const enrollments = await Enrollment.find()
    .populate('student', 'name email')
    .populate('course', 'name category onlinePrice offlinePrice')
    .sort({ enrolledAt: -1 });
  return res.json({ enrollments });
}

import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export async function listMyEnrollments(req, res) {
  const enrollments = await Enrollment.find({ student: req.user.id })
    .populate('course')
    .sort({ enrolledAt: -1 });
  return res.json({ enrollments });
}

export async function enroll(req, res) {
  const deliveryMode = req.body?.deliveryMode || 'online';
  const paymentMethod = req.body?.paymentMethod;
  const transactionId = String(req.body?.transactionId || '').trim();
  if (!['online', 'offline'].includes(deliveryMode)) {
    return res.status(400).json({ message: 'Choose online or offline learning' });
  }
  if (!['bkash', 'nagad'].includes(paymentMethod) || !transactionId) {
    return res.status(400).json({ message: 'Select a payment method and enter the transaction ID' });
  }

  const course = await Course.findOne({ _id: req.params.courseId, published: true });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const priceAtEnrollment =
    deliveryMode === 'offline' ? course.offlinePrice : course.onlinePrice;

  const enrollment = await Enrollment.findOneAndUpdate(
    { student: req.user.id, course: course.id },
    {
      $set: { deliveryMode, priceAtEnrollment, paymentMethod, transactionId, paymentStatus: 'pending' },
      $setOnInsert: { student: req.user.id, course: course.id },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).populate('course');
  return res.status(200).json({ enrollment });
}

export async function cancelEnrollment(req, res) {
  const enrollment = await Enrollment.findOneAndDelete({
    student: req.user.id,
    course: req.params.courseId,
  });
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
  return res.status(204).end();
}

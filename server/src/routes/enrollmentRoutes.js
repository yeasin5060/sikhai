import { Router } from 'express';
import {
  cancelEnrollment,
  enroll,
  listMyEnrollments,
} from '../controllers/enrollmentController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);
router.get('/me', asyncHandler(listMyEnrollments));
router.post('/:courseId', asyncHandler(enroll));
router.delete('/:courseId', asyncHandler(cancelEnrollment));

export default router;

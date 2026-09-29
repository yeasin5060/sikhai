import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  updateCourse,
} from '../controllers/courseController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', asyncHandler(listCourses));
router.get('/:id', asyncHandler(getCourse));
router.post('/', protect, requireAdmin, asyncHandler(createCourse));
router.patch('/:id', protect, requireAdmin, asyncHandler(updateCourse));
router.delete('/:id', protect, requireAdmin, asyncHandler(deleteCourse));

export default router;

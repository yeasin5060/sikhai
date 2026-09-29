import { Router } from 'express';
import { listAllEnrollments, listStudents } from '../controllers/adminController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect, requireAdmin);
router.get('/students', asyncHandler(listStudents));
router.get('/enrollments', asyncHandler(listAllEnrollments));

export default router;

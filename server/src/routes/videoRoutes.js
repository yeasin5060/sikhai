import { Router } from 'express';
import {
  createVideo,
  createVideoUploadSignature,
  deleteVideo,
  listVideos,
} from '../controllers/videoController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', asyncHandler(listVideos));
router.post('/signature', protect, requireAdmin, asyncHandler(createVideoUploadSignature));
router.post('/', protect, requireAdmin, asyncHandler(createVideo));
router.delete('/:id', protect, requireAdmin, asyncHandler(deleteVideo));

export default router;

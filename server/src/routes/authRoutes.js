import { Router } from 'express';
import { currentUser, googleLogin, login, register } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/google', asyncHandler(googleLogin));
router.get('/me', protect, asyncHandler(currentUser));

export default router;

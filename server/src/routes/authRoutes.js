import { Router } from 'express';
import { registerStudent, loginUser, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerStudent);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);

export default router;

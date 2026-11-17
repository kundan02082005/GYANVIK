import { Router } from 'express';
import { createOrder, verifyAndCompletePayment, getStudentPayments, getAllTransactions } from '../controllers/paymentController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.post('/create-order', authenticateToken, createOrder);
router.post('/verify', authenticateToken, verifyAndCompletePayment);
router.get('/my-transactions', authenticateToken, getStudentPayments);

// Admin view
router.get('/all', authenticateToken, requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), getAllTransactions);

export default router;

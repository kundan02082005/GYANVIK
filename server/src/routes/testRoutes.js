import { Router } from 'express';
import {
  getTestSeries,
  getTestDetails,
  submitTestAttempt,
  getStudentHistory,
  createTestSeries
} from '../controllers/testController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/', getTestSeries);
router.get('/history', authenticateToken, getStudentHistory);
router.get('/:id', getTestDetails);
router.post('/attempt', authenticateToken, submitTestAttempt);

// Admin
router.post(
  '/',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_TEST_SERIES', 'TEST_SERIES', (req, body) => ({ resourceId: body.test?.id, details: req.body })),
  createTestSeries
);

export default router;

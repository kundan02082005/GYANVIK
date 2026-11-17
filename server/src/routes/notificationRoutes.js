import { Router } from 'express';
import { getTicker, getNotifications, createNotification, updateNotification, deleteNotification } from '../controllers/notificationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/ticker', getTicker);
router.get('/', getNotifications);

// Admin routes
router.post(
  '/',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_NOTIFICATION', 'NOTIFICATION', (req, body) => ({ resourceId: body.notification?.id, details: req.body })),
  createNotification
);

router.put(
  '/:id',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('UPDATE_NOTIFICATION', 'NOTIFICATION', (req) => ({ resourceId: req.params.id, details: req.body })),
  updateNotification
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('DELETE_NOTIFICATION', 'NOTIFICATION', (req) => ({ resourceId: req.params.id, details: {} })),
  deleteNotification
);

export default router;

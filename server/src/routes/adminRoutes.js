import { Router } from 'express';
import {
  getPlatformStats,
  getAllStudents,
  updateStudentStatus,
  getAllAdmins,
  createAdminAccount,
  updateAdminRole,
  getAuditLogs
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Both Admin and Super Admin can view stats and manage students
router.get('/stats', authenticateToken, requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), getPlatformStats);
router.get('/students', authenticateToken, requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), getAllStudents);
router.put(
  '/students/:id/status',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('UPDATE_STUDENT_STATUS', 'USER', (req) => ({ resourceId: req.params.id, details: req.body })),
  updateStudentStatus
);

// Super Admin exclusive routes
router.get('/admins', authenticateToken, requireRole([ROLES.SUPER_ADMIN]), getAllAdmins);
router.post(
  '/admins',
  authenticateToken,
  requireRole([ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_ADMIN_ACCOUNT', 'ADMIN_ACCOUNT', (req, body) => ({ resourceId: body.admin?.id, details: req.body })),
  createAdminAccount
);
router.put(
  '/admins/:id',
  authenticateToken,
  requireRole([ROLES.SUPER_ADMIN]),
  logAdminAction('UPDATE_ADMIN_ROLE', 'ADMIN_ACCOUNT', (req) => ({ resourceId: req.params.id, details: req.body })),
  updateAdminRole
);
router.get('/audit-logs', authenticateToken, requireRole([ROLES.SUPER_ADMIN]), getAuditLogs);

export default router;

import { Router } from 'express';
import { getCategories, getExamConfig, updateExamConfig, createCategory } from '../controllers/examController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/config/:slug', getExamConfig);

// Admin / Super Admin routes
router.put(
  '/config/:slug',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('UPDATE_EXAM_CONFIG', 'EXAM_CONFIG', (req) => ({ resourceId: req.params.slug, details: req.body })),
  updateExamConfig
);

router.post(
  '/categories',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_EXAM_CATEGORY', 'EXAM_CATEGORY', (req, body) => ({ resourceId: body.category?.slug, details: req.body })),
  createCategory
);

export default router;

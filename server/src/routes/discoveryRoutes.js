import { Router } from 'express';
import { getDiscoveries, createDiscovery, getCompetitions, createCompetition } from '../controllers/discoveryController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/exams', getDiscoveries);
router.get('/competitions', getCompetitions);

// Admin
router.post(
  '/exams',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_DISCOVERY', 'EXAM_DISCOVERY', (req, body) => ({ resourceId: body.discovery?.id, details: req.body })),
  createDiscovery
);

router.post(
  '/competitions',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_COMPETITION', 'COMPETITION', (req, body) => ({ resourceId: body.competition?.id, details: req.body })),
  createCompetition
);

export default router;

import { Router } from 'express';
import {
  getSubjects,
  getChapters,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getNcertResources,
  createNcertResource,
  getShortNotes,
  createShortNote
} from '../controllers/academicController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Public / Student Read
router.get('/subjects', getSubjects);
router.get('/chapters', getChapters);
router.get('/questions', getQuestions);
router.get('/ncert', getNcertResources);
router.get('/short-notes', getShortNotes);

// Admin Question Bank Management
router.post(
  '/questions',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_QUESTION', 'QUESTION_BANK', (req, body) => ({ resourceId: body.question?.id, details: req.body })),
  createQuestion
);

router.put(
  '/questions/:id',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('UPDATE_QUESTION', 'QUESTION_BANK', (req) => ({ resourceId: req.params.id, details: req.body })),
  updateQuestion
);

router.delete(
  '/questions/:id',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('DELETE_QUESTION', 'QUESTION_BANK', (req) => ({ resourceId: req.params.id, details: {} })),
  deleteQuestion
);

// Admin NCERT & Notes
router.post(
  '/ncert',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_NCERT', 'NCERT_LIBRARY', (req, body) => ({ resourceId: body.resource?.id, details: req.body })),
  createNcertResource
);

router.post(
  '/short-notes',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_SHORT_NOTE', 'SHORT_NOTES', (req, body) => ({ resourceId: body.note?.id, details: req.body })),
  createShortNote
);

export default router;

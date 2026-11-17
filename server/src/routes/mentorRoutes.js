import { Router } from 'express';
import {
  getMentors,
  createMentor,
  bookMentor,
  getStudentBookings,
  getAllBookings,
  updateBooking
} from '../controllers/mentorController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLogger.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/', getMentors);
router.post('/book', authenticateToken, bookMentor);
router.get('/my-bookings', authenticateToken, getStudentBookings);

// Admin endpoints
router.get('/all-bookings', authenticateToken, requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), getAllBookings);
router.put(
  '/bookings/:id',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('UPDATE_MENTOR_BOOKING', 'MENTOR_BOOKING', (req) => ({ resourceId: req.params.id, details: req.body })),
  updateBooking
);

// Super Admin / Admin mentor recruitment
router.post(
  '/',
  authenticateToken,
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  logAdminAction('CREATE_MENTOR', 'MENTOR_DIRECTORY', (req, body) => ({ resourceId: body.mentor?.id, details: req.body })),
  createMentor
);

export default router;

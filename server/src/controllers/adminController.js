import bcrypt from 'bcryptjs';
import { store } from '../db/store.js';
import { ROLES } from '../config/constants.js';

export const getPlatformStats = (req, res) => {
  const students = store.profiles.filter(p => p.role === ROLES.STUDENT);
  const admins = store.profiles.filter(p => p.role === ROLES.ADMIN || p.role === ROLES.SUPER_ADMIN);
  const totalRevenue = store.payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((acc, curr) => acc + (curr.amountInr || 0), 0);

  return res.json({
    success: true,
    stats: {
      totalStudents: students.length,
      totalAdmins: admins.length,
      totalQuestions: store.questions.length,
      totalMockTests: store.testSeries.length,
      totalMentors: store.mentors.length,
      totalBookings: store.mentorBookings.length,
      totalNotifications: store.notifications.length,
      totalRevenueInr: totalRevenue,
      totalTestAttempts: store.testAttempts.length
    }
  });
};

export const getAllStudents = (req, res) => {
  const students = store.profiles
    .filter(p => p.role === ROLES.STUDENT)
    .map(({ passwordHash: _, ...safeUser }) => {
      const attempts = store.getStudentAttempts(safeUser.id);
      const bookings = store.getStudentBookings(safeUser.id);
      const avgAccuracy = attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracyPct || 0), 0) / attempts.length)
        : 0;
      return {
        ...safeUser,
        attemptsCount: attempts.length,
        avgAccuracy,
        bookingsCount: bookings.length
      };
    });

  return res.json({ success: true, count: students.length, students });
};

export const updateStudentStatus = (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const updated = store.updateUser(id, { isActive: Boolean(isActive) });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Student account not found.' });
  }

  const { passwordHash: _, ...safeUser } = updated;
  return res.json({
    success: true,
    message: `Student account ${isActive ? 'activated' : 'suspended'} successfully.`,
    user: safeUser
  });
};

// Super Admin Only: Manage Admins
export const getAllAdmins = (req, res) => {
  const admins = store.profiles
    .filter(p => p.role === ROLES.ADMIN || p.role === ROLES.SUPER_ADMIN)
    .map(({ passwordHash: _, ...safeUser }) => safeUser);

  return res.json({ success: true, admins });
};

export const createAdminAccount = async (req, res) => {
  try {
    const { fullName, email, password, phone, role = ROLES.ADMIN, bio } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full Name, Email, and Password are required.' });
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = store.createUser({
      fullName,
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role === ROLES.SUPER_ADMIN ? ROLES.SUPER_ADMIN : ROLES.ADMIN,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      phone: phone || '',
      classLevel: role === ROLES.SUPER_ADMIN ? 'Super Admin' : 'Academic Admin',
      bio: bio || 'Authorized Gyanvik Administrator',
      isActive: true
    });

    const { passwordHash: _, ...safeAdmin } = newAdmin;
    return res.status(201).json({
      success: true,
      message: `Authorized ${role} account created successfully.`,
      admin: safeAdmin
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create admin account.', error: err.message });
  }
};

export const updateAdminRole = (req, res) => {
  const { id } = req.params;
  const { role, isActive } = req.body;

  // Cannot suspend the primary super admin
  if (id === 'super-admin-001' && isActive === false) {
    return res.status(400).json({ success: false, message: 'Root Super Admin cannot be deactivated.' });
  }

  const updated = store.updateUser(id, {
    ...(role && { role }),
    ...(isActive !== undefined && { isActive: Boolean(isActive) })
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Admin account not found.' });
  }

  const { passwordHash: _, ...safeAdmin } = updated;
  return res.json({ success: true, message: 'Admin permissions updated successfully.', admin: safeAdmin });
};

export const getAuditLogs = (req, res) => {
  const { limit = 50 } = req.query;
  const logs = store.getAuditLogs(parseInt(limit, 10));
  return res.json({ success: true, count: logs.length, logs });
};

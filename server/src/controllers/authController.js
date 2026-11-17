import bcrypt from 'bcryptjs';
import { store } from '../db/store.js';
import { generateToken } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

export const registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      targetExam = 'NEET',
      classLevel = '12th',
      guardianName,
      guardianPhone,
      guardianConsent = false
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Email, and Password are required.'
      });
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newStudent = store.createUser({
      fullName,
      email: email.trim().toLowerCase(),
      passwordHash,
      role: ROLES.STUDENT,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      phone: phone || '',
      targetExam,
      classLevel,
      guardianName: guardianName || '',
      guardianPhone: guardianPhone || '',
      guardianConsent: Boolean(guardianConsent),
      bio: `Aspirant aiming for excellence in ${targetExam}.`
    });

    const token = generateToken(newStudent);
    const { passwordHash: _, ...safeProfile } = newStudent;

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Gyanvik.',
      token,
      user: safeProfile
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete registration.',
      error: err.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, loginType } = req.body; // loginType: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN'

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact platform support.'
      });
    }

    // Role verification against login portal chosen
    if (loginType === 'ADMIN') {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This account does not possess Admin privileges. Please use Student Login.'
        });
      }
    } else if (loginType === 'SUPER_ADMIN') {
      if (user.role !== ROLES.SUPER_ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: High-level Super Admin authorization required.'
        });
      }
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeProfile } = user;

    // Log sign-in for security
    store.addAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'USER_LOGIN',
      resourceType: 'SESSION',
      resourceId: user.id,
      details: { loginType: loginType || user.role, platform: 'Web' },
      ipAddress: req.ip || req.connection.remoteAddress
    });

    return res.json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: safeProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process login.',
      error: err.message
    });
  }
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  const { passwordHash: _, ...safeProfile } = req.user;
  return res.json({ success: true, user: safeProfile });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, targetExam, classLevel, bio, guardianName, guardianPhone, guardianConsent } = req.body;
    const updated = store.updateUser(req.user.id, {
      ...(fullName && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(targetExam && { targetExam }),
      ...(classLevel && { classLevel }),
      ...(bio !== undefined && { bio }),
      ...(guardianName !== undefined && { guardianName }),
      ...(guardianPhone !== undefined && { guardianPhone }),
      ...(guardianConsent !== undefined && { guardianConsent: Boolean(guardianConsent) })
    });

    const { passwordHash: _, ...safeProfile } = updated;
    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: safeProfile
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: err.message
    });
  }
};

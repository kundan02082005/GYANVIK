import jwt from 'jsonwebtoken';
import { store } from '../db/store.js';
import { supabaseClient, isSupabaseConfigured } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'gyanvik_super_secure_jwt_secret_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No authentication token provided.'
    });
  }

  // 1. Try Supabase token verification if configured
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);
      if (user && !error) {
        let profile = store.findUserById(user.id) || store.findUserByEmail(user.email);
        if (!profile) {
          profile = {
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || 'Gyanvik User',
            role: user.user_metadata?.role || 'STUDENT'
          };
        }
        req.user = profile;
        return next();
      }
    } catch {
      // Fall through to local JWT verification
    }
  }

  // 2. Standard JWT token verification
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.findUserById(decoded.id) || store.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user account not found.'
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been suspended. Please contact platform administration.'
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired session token.',
      error: err.message
    });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires ${allowedRoles.join(' or ')} authorization.`
      });
    }
    next();
  };
};

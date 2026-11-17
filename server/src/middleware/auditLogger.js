import { store } from '../db/store.js';

export const logAdminAction = (action, resourceType, getResourceIdAndDetails) => {
  return (req, res, next) => {
    // Wrap original send / json to log after successful response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          const { resourceId, details } = typeof getResourceIdAndDetails === 'function'
            ? getResourceIdAndDetails(req, body)
            : { resourceId: req.params?.id || 'GLOBAL', details: req.body };

          store.addAuditLog({
            userId: req.user.id,
            userEmail: req.user.email,
            userRole: req.user.role,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress: req.ip || req.connection.remoteAddress
          });
        } catch (e) {
          console.error('Failed to log admin action:', e);
        }
      }
      return originalJson(body);
    };
    next();
  };
};

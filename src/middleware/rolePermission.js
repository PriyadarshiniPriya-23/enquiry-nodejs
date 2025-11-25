// src/middleware/rolePermission.js
// Usage: attach to route handlers as middleware factory: permitForRoute()
function permitForRoute(options = {}) {
  // options.allowedMethodsByRole or options.requiredRoles (explicit)
  const requiredRoles = options.requiredRoles || [];
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) return res.status(403).json({ error: 'Not authenticated with role' });

    const role = user.role;

    // If explicit requiredRoles are provided, enforce them (admin still allowed)
    if (requiredRoles.length) {
      if (role === 'admin' || requiredRoles.includes(role)) return next();
      return res.status(403).json({ error: 'Forbidden' });
    }

    // admin always allowed
    if (role === 'admin') return next();

    const method = req.method.toUpperCase();

    // Mirror Django rule set:
    if (method === 'POST') {
      if (['counsellor', 'admin'].includes(role)) return next();
      return res.status(403).json({ error: 'POST not allowed for your role' });
    }

    if (['PATCH','PUT'].includes(method)) {
      if (['admin','accounts','counsellor','hr'].includes(role)) return next();
      return res.status(403).json({ error: `${method} not allowed for your role` });
    }

    if (method === 'GET') {
      if (['admin','counsellor','accounts','hr'].includes(role)) return next();
      return res.status(403).json({ error: 'GET not allowed for your role' });
    }

    if (method === 'DELETE') {
      if (role === 'admin') return next();
      return res.status(403).json({ error: 'DELETE only allowed for admin' });
    }

    return res.status(403).json({ error: 'Forbidden' });
  };
}

module.exports = { permitForRoute };

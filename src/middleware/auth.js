// src/middleware/auth.js
const { verifyToken } = require('../utils/jwt');

async function authenticateToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = await verifyToken(token);
    // Expected payload: { userId, username, role, ... }
    console.log(payload)
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
}

module.exports = { authenticateToken };

// src/controllers/authController.js
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');
const db = require('../db');
const { loginSchema, registerSchema } = require('../validators/authValidator');

const User = db.User;
const AccessControl = db.AccessControl;

async function login(req, res) {
  try {
    
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    const { email, password } = value;
    const user = await User.findOne({ where: { email }, include: [{ model: AccessControl, as: 'accessControl' }]});
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const role = user.accessControl ? user.accessControl.role : 'consumer';
    const payload = { userId: user.id, username: user.username, email: user.email, role };
    const access = await signToken(payload, process.env.JWT_EXPIRES_IN || '7d');

    return res.json({ access, user_id: user.id, email: user.email, role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function createUser(req, res) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    const { username, email, password, role } = value;

    const existsUser = await User.findOne({ where: { [db.Sequelize.Op.or]: [{ username }, { email }] }});
    if (existsUser) return res.status(400).json({ error: 'Username or email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password_hash: hash });

    // Enforce role assignment rules: only admin can assign roles other than the default 'counsellor'
    const requesterRole = req.user && req.user.role ? req.user.role : null;
    let assignedRole = role || 'counsellor';

    if (requesterRole !== 'admin') {
      // If a non-admin attempted to assign a role other than 'counsellor', block it
      if (role && role !== 'counsellor') {
        return res.status(403).json({ error: 'Only admin can assign roles other than counsellor' });
      }
      assignedRole = role || 'counsellor';
    }

    await AccessControl.create({ userId: user.id, role: assignedRole });

    return res.status(201).json({ email: user.email, username: user.username, role: assignedRole });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { login, createUser };

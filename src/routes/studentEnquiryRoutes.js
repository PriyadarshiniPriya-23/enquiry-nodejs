const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentEnquiryController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, ctrl.listCreate);
router.post('/', authenticateToken, ctrl.listCreate);
router.get('/:id', authenticateToken, ctrl.detail);
router.put('/:id', authenticateToken, ctrl.detail);
router.delete('/:id', authenticateToken, ctrl.detail);

module.exports = router;

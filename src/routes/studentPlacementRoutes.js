const express = require('express');
const router = express.Router();
const { studentPlacementView, createStudentPlacement } = require('../controllers/studentPlacementController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, studentPlacementView);
router.post('/', authenticateToken, studentPlacementView);
router.put('/', authenticateToken, studentPlacementView);

router.get('/create', authenticateToken, createStudentPlacement);
router.post('/create', authenticateToken, createStudentPlacement);

module.exports = router;

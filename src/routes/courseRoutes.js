// courseRoutes.js
const express = require('express');
const router = express.Router();
const { list } = require('../controllers/courseController');

router.get('/', list);
module.exports = router;
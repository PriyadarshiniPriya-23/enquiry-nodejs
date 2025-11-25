// src/routes/enquiryRoutes.js
const express = require('express');
const router = express.Router();
const { listCreateEnquiries, getUpdateDeleteEnquiry } = require('../controllers/enquiryController');
const { authenticateToken } = require('../middleware/auth');
const { permitForRoute } = require('../middleware/rolePermission');

router.route('/')
  .all(authenticateToken)         // require token
  .get(permitForRoute(), listCreateEnquiries)
  .post(permitForRoute(), listCreateEnquiries);

router.route('/:id')
  .all(authenticateToken)
  .get(permitForRoute(), getUpdateDeleteEnquiry)
  .put(permitForRoute(), getUpdateDeleteEnquiry)
  .delete(permitForRoute(), getUpdateDeleteEnquiry);

module.exports = router;

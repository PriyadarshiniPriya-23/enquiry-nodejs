// src/controllers/batchTimingController.js
const db = require('../db');
const BatchTiming = db.BatchTiming;

async function list(req, res) {
  const course_id = req.query.course_id;
  const where = course_id ? { courseId: course_id } : {};
  const timings = await BatchTiming.findAll({ where });
  return res.json(timings);
}

module.exports = { list };

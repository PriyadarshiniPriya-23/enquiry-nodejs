// src/controllers/courseController.js
const db = require('../db');
const Course = db.Course;

async function list(req, res) {
  try {
    const courses = await Course.findAll({ include: [{ model: db.BatchTiming, as: 'batch_timings' }]});
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { list };

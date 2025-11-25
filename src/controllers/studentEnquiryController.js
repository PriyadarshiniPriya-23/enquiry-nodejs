// src/controllers/studentEnquiryController.js
const db = require('../db');
const StudentEnquiry = db.StudentEnquiry;

async function listCreate(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await StudentEnquiry.findAll();
      return res.json(data);
    }
    // POST
    const created = await StudentEnquiry.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}

async function detail(req, res) {
  try {
    const id = req.params.id;
    const obj = await StudentEnquiry.findByPk(id);
    if (!obj) return res.status(404).json({ error: 'Not found' });
    if (req.method === 'GET') return res.json(obj);
    if (req.method === 'PUT') {
      await obj.update(req.body);
      return res.json(obj);
    }
    if (req.method === 'DELETE') {
      await obj.destroy();
      return res.status(204).send();
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { listCreate, detail };

// src/controllers/studentPlacementController.js
const db = require('../db');
const StudentPlacement = db.StudentPlacement;
const Enquiry = db.Enquiry;
const Experience = db.Experience; // if exists and associated

async function studentPlacementView(req, res) {
  try {
    const enquiry_id = req.query.enquiry_id || req.body.enquiry_id;
    if (!enquiry_id) return res.status(400).json({ error: 'Missing enquiry_id' });

    const enquiry = await Enquiry.findByPk(enquiry_id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

    if (req.method === 'GET') {
      const placement = await StudentPlacement.findOne({ where: { enquiryId: enquiry.id } });
      if (placement) return res.json({ prefilled: true, data: placement });
      const data = {
        enquiry: enquiry.id,
        full_name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        course: enquiry.module,
        location_current: enquiry.current_location,
        consent: enquiry.consent
      };
      return res.json({ prefilled: false, data });
    }

    if (req.method === 'POST') {
      // prevent duplicate submission
      const existing = await StudentPlacement.findOne({ where: { enquiryId: enquiry.id }});
      if (existing) return res.status(400).json({ error: 'Form already submitted!' });
      const created = await StudentPlacement.create(req.body, { include: [Experience] }); // if experiences nested
      // Mark link_active false if your model has such field
      if (enquiry.link_active !== undefined) {
        enquiry.link_active = false;
        await enquiry.save();
      }
      return res.status(201).json(created);
    }

    if (req.method === 'PUT') {
      const placement = await StudentPlacement.findOne({ where: { enquiryId: enquiry.id }});
      if (!placement) return res.status(404).json({ error: 'Placement not found' });
      await placement.update(req.body);
      return res.json(placement);
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}

async function createStudentPlacement(req, res) {
  try {
    if (req.method === 'GET') {
      const enquiry_id = req.query.enquiry_id;
      if (!enquiry_id) return res.status(400).json({ error: 'Missing enquiry_id' });
      const placement = await StudentPlacement.findOne({ where: { enquiryId: enquiry_id }}) || await StudentPlacement.findByPk(enquiry_id);
      if (!placement) return res.status(404).json({ error: 'No student placement record found' });
      return res.json({ data: placement });
    }
    // POST
    const created = await StudentPlacement.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { studentPlacementView, createStudentPlacement };

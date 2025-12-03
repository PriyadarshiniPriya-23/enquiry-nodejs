// src/controllers/enquiryController.js
const db = require('../db');
const { createEnquirySchema } = require('../validators/enquiryValidator');

const Enquiry = db.Enquiry;
const AccessControl = db.AccessControl;

async function listCreateEnquiries(req, res) {
  try {
    // POST -> create
    if (req.method === 'POST') {
      const { error, value } = createEnquirySchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details });

      const userId = req.user ? req.user.userId : null;
      const created = await Enquiry.create({ ...value, userId });
      return res.status(201).json(created);
    }

    // GET -> listing with role-based filtering
    const userId = req.user.userId;
    console.log(userId)
    const userRoleObj = await AccessControl.findOne({ where: { userId }});
    console.log(userRoleObj)
    const userRole = userRoleObj ? userRoleObj.role : 'consumer';
    console.log(userRole)

    let results;
    if (userRole === 'admin') {
      results = await Enquiry.findAll({ order: [['created_at','DESC']] });
    } else if (userRole === 'accounts') {
      results = await Enquiry.findAll({ where: { move_to_acc: true }});
    } else if (userRole === 'hr') {
      // Django used exclude(follow_up_note="") — translate to where follow_up_note IS NOT NULL AND != ''
      results = await Enquiry.findAll({
        where: db.Sequelize.where(db.Sequelize.fn('coalesce', db.Sequelize.col('follow_up_note'), " "), { [db.Sequelize.Op.ne]: '' })
      });
      console.log(results)
    } else {
      results = await Enquiry.findAll({ where: { userId }});
    }
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getUpdateDeleteEnquiry(req, res) {
  try {
    const id = req.params.id;
    const enquiry = await Enquiry.findByPk(id);
    if (!enquiry) return res.status(404).json({ error: 'Not found' });

    if (req.method === 'GET') return res.json(enquiry);

    if (req.method === 'PUT' || req.method === 'PATCH') {
      // compute balanceAmount logic same as serializer update
      const updates = req.body;
      const packageCost = updates.packageCost !== undefined ? updates.packageCost : enquiry.packageCost || 0;
      const amountPaid = updates.amountPaid !== undefined ? updates.amountPaid : enquiry.amountPaid || 0;
      const discount = updates.discount !== undefined ? updates.discount : enquiry.discount || 0;
      updates.balanceAmount = packageCost - amountPaid - discount;

      await enquiry.update(updates);
      return res.json(enquiry);
    }

    if (req.method === 'DELETE') {
      await enquiry.destroy();
      return res.json({ message: 'Deleted' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listCreateEnquiries, getUpdateDeleteEnquiry };

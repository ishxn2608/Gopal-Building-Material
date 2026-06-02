const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { adminAuth } = require('../middleware/auth');

// All admin routes require auth
router.use(adminAuth);

// GET /api/admin/enquiries – list all enquiries
router.get('/enquiries', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/enquiries/:id – update status
router.patch('/enquiries/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/enquiries/:id
router.delete('/enquiries/:id', async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();
    const newCount = await Enquiry.countDocuments({ status: 'new' });
    const contacted = await Enquiry.countDocuments({ status: 'contacted' });
    const closed = await Enquiry.countDocuments({ status: 'closed' });
    const today = new Date(); today.setHours(0,0,0,0);
    const todayCount = await Enquiry.countDocuments({ createdAt: { $gte: today } });
    res.json({ success: true, data: { total, new: newCount, contacted, closed, today: todayCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

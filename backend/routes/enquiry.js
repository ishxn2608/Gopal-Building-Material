const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ✅ CORRECT: Import the single compiled model from your dedicated models folder
const Enquiry = require('../models/Enquiry');

// Configure Mail Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ── POST: Handle New Submission ───────────────────────────────
router.post('/', async (req, res) => {
  console.log('📬 API received incoming packet:', req.body);
  const { name, phone, service, message } = req.body;

  if (!name || !phone || !service) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed. Required fields missing.' 
    });
  }

  try {
    // Save record to MongoDB Atlas cluster
    const newEnquiry = new Enquiry({ name, phone, service, message });
    await newEnquiry.save();
    console.log('🌿 Database write transaction successfully finalized.');

    // Asynchronous background email execution (Non-blocking)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'thegopalbuildingmaterial@gmail.com',
        subject: `New Web Enquiry - ${name.substring(0, 20)}`,
        text: `New customer submission:\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message || 'None'}`
      };

      transporter.sendMail(mailOptions)
        .then(() => console.log('📧 Background email dispatched successfully.'))
        .catch(mailErr => console.error('⚠️ Background email warning:', mailErr.message));
    }

    // Return instant server response back to user
    return res.status(201).json({ 
      success: true, 
      message: 'Your enquiry has been successfully registered!' 
    });

  } catch (error) {
    console.error('❌ Database path exception caught:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server database save error.' 
    });
  }
});

// ── GET: Fetch Enquiries for Admin Panel ───────────────────────
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: enquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load panel data.' });
  }
});

module.exports = router;

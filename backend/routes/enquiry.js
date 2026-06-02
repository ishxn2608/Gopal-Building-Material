const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const nodemailer = require('nodemailer');
const { enquiryLimiter } = require('../middleware/rateLimiter');

// ── Email transporter ──────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper: send notification email to owner
async function sendOwnerNotification(enquiry) {
  const mailOptions = {
    from: `"Website Enquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `New Enquiry from ${enquiry.name} – Gopal Building Material`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;border:1px solid #e8ddd5;padding:24px;border-radius:6px">
        <h2 style="color:#b89a6a;margin-top:0">New Website Enquiry</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#8a7060;font-size:13px">Name</td><td style="padding:8px 0;font-weight:500">${enquiry.name}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7060;font-size:13px">Phone</td><td style="padding:8px 0">${enquiry.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7060;font-size:13px">Service</td><td style="padding:8px 0">${enquiry.service}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7060;font-size:13px;vertical-align:top">Message</td><td style="padding:8px 0">${enquiry.message || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7060;font-size:13px">Received</td><td style="padding:8px 0">${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</td></tr>
        </table>
        <a href="https://wa.me/91${enquiry.phone.replace(/[^0-9]/g,'')}" 
           style="display:inline-block;margin-top:16px;background:#25d366;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:14px">
          Reply on WhatsApp
        </a>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
}

// ── POST /api/enquiry – Submit new enquiry ─────────────────────
router.post('/', enquiryLimiter, async (req, res) => {
  try {
    const { name, phone, service, message } = req.body;

    // Basic validation
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ success: false, message: 'Phone is required' });

    const enquiry = await Enquiry.create({ name: name.trim(), phone: phone.trim(), service, message: message?.trim() });

    // Send email notification (non-blocking – don't fail if email fails)
    try {
      await sendOwnerNotification(enquiry);
    } catch (emailErr) {
      console.warn('Email notification failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will contact you soon.',
      id: enquiry._id
    });
  } catch (error) {
    console.error('Enquiry error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── GET /api/enquiry – Get all (admin only, handled in admin routes) ──
router.get('/', async (req, res) => {
  res.status(403).json({ success: false, message: 'Access denied' });
});

module.exports = router;

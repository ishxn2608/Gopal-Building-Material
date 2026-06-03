const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Define/Reuse Schema Layer cleanly
const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  service: { type: String, required: true },
  message: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

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
  console.log('📬 API received incoming registration packet:', req.body);
  const { name, phone, service, message } = req.body;

  // Instant Validation Fail-Safe Check
  if (!name || !phone || !service) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed. Name, Phone, and Service fields are strictly required.' 
    });
  }

  try {
    // 1. Core Storage Operation (Executes in milliseconds)
    const newEnquiry = new Enquiry({ name, phone, service, message });
    await newEnquiry.save();
    console.log('🌿 Database write transaction successfully finalized.');

    // 2. ASYNCHRONOUS BACKGROUND EMAIL EXECUTION [5]
    // We intentionally do NOT use 'await' here. The email process detaches [4, 5]
    // and finishes in the background, preventing network lag for the client [4, 5].
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'thegopalbuildingmaterial@gmail.com',
        subject: `New Web Enquiry - ${name.substring(0, 20)}`,
        text: `New customer submission details:\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message || 'None provided'}`
      };

      transporter.sendMail(mailOptions)
        .then(() => console.log('📧 Background email dispatched successfully.'))
        .catch(mailErr => console.error('⚠️ Non-blocking background email failure:', mailErr.message));
    }

    // 3. INSTANT SERVER RESPONSE
    // Return back an immediate response acknowledgment to the frontend within 1-2 seconds [4, 5].
    return res.status(201).json({ 
      success: true, 
      message: 'Your enquiry has been successfully registered!' 
    });

  } catch (error) {
    console.error('❌ Critical database path exception caught:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server exception encountered during storage processing.' 
    });
  }
});

module.exports = router;

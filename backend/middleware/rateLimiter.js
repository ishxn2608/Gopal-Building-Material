const rateLimit = require('express-rate-limit');

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

module.exports = { enquiryLimiter };

const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name too long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  service: {
    type: String,
    enum: [
      'Home Furniture',
      'Office Furniture',
      'Custom / Modular Work',
      'Complete Interior Setup',
      'Doors & Windows',
      'Repair & Restoration',
      'Other'
    ],
    default: 'Other'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message too long']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    default: 'website'
  }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);

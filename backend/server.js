const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('📝 Loading environment variables...');
console.log('🔗 Detected Port from .env:', process.env.PORT); 

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// ✅ MAKE SURE THIS LINE IS NOT MISSING OR COMMENTED OUT:
const connectDB = require('./config/db'); 

console.log('📦 Dependencies loaded successfully');

const app = express();

// ── Connect Database ───────────────────────────────────────────
console.log('🔗 Initializing database connection...');
connectDB(); // This will now execute perfectly!

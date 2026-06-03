const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('📝 Loading environment variables...');
console.log('🔗 Detected Port from env:', process.env.PORT || 5000);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// ✅ CRITICAL IMPORT RESTORED:
const connectDB = require('./config/db'); 

console.log('📦 Dependencies loaded successfully');

const app = express();

// ── Connect Database ───────────────────────────────────────────
console.log('🔗 Initializing database connection...');
connectDB();

// ── Middleware ─────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files (Frontend) ────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/enquiry', require('./routes/enquiry'));
app.use('/api/admin',   require('./routes/admin'));

// ── Serve HTML Pages ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/admin/dashboard.html'));
});

// ── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ── Start Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`🌿 Environment: ${process.env.NODE_ENV}`);
});

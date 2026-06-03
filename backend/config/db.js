const mongoose = require('mongoose');

const connectDB = async () => {
  // ✅ Explicitly use process.env.MONGO_URI from the environment variables
  const dbURI = process.env.MONGO_URI; 

  if (!dbURI) {
    console.error("❌ MongoDB Error: Connection String is undefined!");
    return;
  }

  try {
    await mongoose.connect(dbURI);
    console.log('🌿 MongoDB Connected Successfully!');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
};

module.exports = connectDB;

// Simple basic-auth middleware for admin panel
const adminAuth = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  const base64 = auth.split(' ')[1];
  const [username, password] = Buffer.from(base64, 'base64').toString().split(':');
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Invalid credentials' });
};

module.exports = { adminAuth };

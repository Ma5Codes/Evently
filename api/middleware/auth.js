const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'bsbsfbrnsftentwnnwnwn';

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const userData = jwt.verify(token, jwtSecret);
    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}; 
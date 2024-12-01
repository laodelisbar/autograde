const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(); // Proceed to the next middleware if no token is provided
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Save token payload to req.user
  } catch (err) {
    console.log(err.message);
  }

  next(); // Proceed to the next middleware
};

module.exports = authenticateToken;
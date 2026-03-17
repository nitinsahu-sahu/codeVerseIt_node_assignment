const jwt = require('jsonwebtoken');

exports.auth=(req, res, next)=> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token

  if (token == null) return res.sendStatus(401); // If no token, unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid/expired, forbidden
    req.user = user; // Attach user info to the request
    next(); // Pass to the next middleware/handler
  });
}

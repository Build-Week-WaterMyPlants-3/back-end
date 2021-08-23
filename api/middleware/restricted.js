const jwt = require('jsonwebtoken');
const secrets = require('../config/secret');

module.exports = (req, res, next) => {
  const token = req.header('authorization');
  if(!token) {
    res.status(400).json({ message: 'You must be logged in before visiting this page' });
  } else {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err) {
        res.status(401).json({ message: 'Token not found', err });
      } else {
        req.decodedToken = decodedToken;
        next();
      };
    });
  };
};

require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(403).send({
          status: false,
          message: err.message || "AuthToken error"
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(403).send({
      status: false,
      message: "Pleas pass authorization Token"
    });
  }
};

module.exports = authenticateJWT;
const jwt = require("jsonwebtoken");

/**
 * Verify token, verify with secret key
 * @param {string} token
 * @returns {object} payload
 */
const verifyToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};

module.exports = verifyToken;

const jwt = require("jsonwebtoken");

/**
 * Verify token, verify with secret key
 * @param {string} token
 * @returns {object} payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid signature");
  }
};

module.exports = verifyToken;

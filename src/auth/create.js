const jwt = require("jsonwebtoken");

/**
 * Create a token, sign with secret key
 * @param {object} data
 * @returns {string} token
 */
const createToken = (data) => {
  const payload = {
    sub: data.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1),
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

module.exports = createToken;

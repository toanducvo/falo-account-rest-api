const jwt = require("jsonwebtoken");
const verifyToken = require("./verify");

/**
 * Refresh token, sign with secret key
 * @param {string} token
 * @returns {string} newToken
 */
const refreshToken = (token) => {
  const payload = await verifyToken(token);
  const newToken = jwt.sign(
    {
      sub: payload.sub,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.JWT_SECRET
  );
  return newToken;
};

module.exports = refreshToken;

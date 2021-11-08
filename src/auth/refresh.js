const jwt = require("jsonwebtoken");
const verifyToken = require("./verify");

/**
 * Refresh token, sign with secret key
 * @param {string} token
 * @returns {string} newToken
 */
const refreshToken = (token) => {
  const payload = verifyToken(token);
  const newToken = jwt.sign(
    {
      sub: payload.sub,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 14),
    },
    process.env.JWT_SECRET_REFRESH
  );
  return newToken;
};

module.exports = refreshToken;

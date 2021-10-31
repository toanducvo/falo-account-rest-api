const jwt = require("jsonwebtoken");

/**
 * Refresh token, sign with secret key
 * @param {string} token
 * @returns {string} newToken
 */
const refreshToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const newToken = jwt.sign(
    {
      sub: payload.sub,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60 * 24,
    }
  );
  return newToken;
};

module.exports = refreshToken;

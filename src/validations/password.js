const express = require("express");

const { StatusCodes } = require("http-status-codes");

const { isEmpty, isStrongPassword, isLength } = require("validator").default;

/**
 * Validates the password
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws If the password is not found
 * @throws If the password is empty
 * @throws If the password is not strong
 * @throws If the password is not long enough
 * @throws If the password and confirm password do not match
 * @returns {void}
 */
const validatePassword = (req, res, next) => {
  try {
    if (
      (!req.body.password || !req.body.confirmPassword) &&
      req.path === "register"
    )
      throw new Error("Missing password or confirmPassword");

    // Get password and confirm password from request body
    const { password, confirmPassword } = req.body;

    // // Check password and confirm password are not empty string
    // if (isEmpty(password) || isEmpty(confirmPassword))
    //   throw new Error("Password and confirm password are required");

    // Password length must be greater than 8 characters
    if (!isLength(password, { min: 8, max: 30 }))
      throw new Error(
        "Password must be at least 8 characters and up to 30 characters long"
      );

    // Check password is strong enough
    if (!isStrongPassword(password))
      throw new Error("Password is not strong enough");

    // Check password and confirm password are the same
    if (password !== confirmPassword && req.path === "register")
      throw new Error("Password and confirm password must be the same");

    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = validatePassword;

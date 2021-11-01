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
 * @returns {void}
 */
const validatePassword = (req, res, next) => {
  try {
    if (!req.body.password) throw new Error("Password is required");

    // Get password from request body
    const { password } = req.body;

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

    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = validatePassword;

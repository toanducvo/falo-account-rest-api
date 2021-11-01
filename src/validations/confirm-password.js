const express = require("express");
const { StatusCodes } = require("http-status-codes");

/**
 *  Validates the confirm password field
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws If confirm password is not found
 * @throws If the password and confirm password do not match
 * @returns {void}
 */
const validateConfirmPassword = (req, res, next) => {
  try {
    if (!req.body.confirmPassword)
      throw new Error("Confirm Password is required");

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) throw new Error("Passwords do not match");

    next();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = validateConfirmPassword;

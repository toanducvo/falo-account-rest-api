const express = require("express");

const { StatusCodes } = require("http-status-codes");

const { isEmpty } = require("validator").default;

/**
 * Validate Fullname
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws If the fullname is not valid
 * @returns {void}
 */
const validateFullName = (req, res, next) => {
  try {
    if (!req.body.fullName) throw new Error("Full name is required");

    const { fullName } = req.body;

    // Check if full name is not empty and has no special characters
    // If not valid, throw error
    if (isEmpty(fullName) || !new RegExp(/^[a-zA-Z ]+$/).test(fullName))
      throw new Error("Your name is invalid");

    if (fullName.length < 2) throw new Error("Your name is too short");

    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = validateFullName;

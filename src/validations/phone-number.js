const express = require("express");

const { StatusCodes } = require("http-status-codes");

const { isEmpty, isMobilePhone } = require("validator").default;

// Default locale for validator is vi-VN'
const defaulLocale = "vi-VN";

/**
 * Validate phone number
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws If phone number is missing or invalid
 * @returns {void}
 */
const validatePhoneNumber = async (req, res, next) => {
  try {
    if (!req.body.phoneNumber) throw new Error("Missing phone number");

    const phoneNumber = req.body.phoneNumber;

    if (isEmpty(phoneNumber)) throw new Error("Phone number is required");

    if (!isMobilePhone(phoneNumber, defaulLocale))
      throw new Error("Phone number is invalid");

    // If all is ok, continue
    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = validatePhoneNumber;

const express = require("express");

const { StatusCodes } = require("http-status-codes");

const defaultGenders = ["male", "female"];

/**
 * Validate gender
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws If the gender is not invalid
 * @returns {void}
 */
const validateGender = (req, res, next) => {
  try {
    if (!req.body.gender) throw new Error("Gender is required");

    const { gender } = req.body;

    if (!defaultGenders.includes(gender)) throw new Error("Invalid gender");

    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = validateGender;

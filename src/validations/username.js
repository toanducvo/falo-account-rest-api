const express = require("express");

const { StatusCodes } = require("http-status-codes");

const { isEmpty, isLength } = require("validator").default;

/**
 * Checks if the username is valid
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws If the username is empty
 * @throws If the username is too long
 * @throws If the username is too short
 * @throws If the username is not alphanumeric
 * @returns {void}
 */
const validateUsername = (req, res, next) => {
  try {
    // If request has username property
    if (!req.body.username) throw new Error("Username is required");

    const username = req.body.username;

    // // If username is empty
    // // or has one or more special characters
    // if (isEmpty(username) || new RegExp(/\W{1,}/).test(username))
    //   throw new Error("Invalid username");

    // Username must be from 5 to 20 characters long
    if (!isLength(username, { min: 5, max: 20 }))
      throw new Error("Username must be between 5 and 20 characters");

    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = validateUsername;

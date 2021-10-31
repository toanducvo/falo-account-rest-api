const express = require("express");

const { StatusCodes, getReasonPhrase: Message } = require("http-status-codes");

/**
 * Request header validation
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const validateHeader = (req, res, next) => {
  //If Content-Type header did not match application/json or application/x-www-form-urlencoded, return 415
  // return 415 - Unsupported Media Type
  if (!req.is(["application/json", "application/x-www-form-urlencoded"]))
    return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
      status: "error",
      message: Message(StatusCodes.UNSUPPORTED_MEDIA_TYPE),
    });
  // Continue to next middleware
  next();
};

module.exports = validateHeader;

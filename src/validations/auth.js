const express = require("express");

const { StatusCodes, getReasonPhrase: Message } = require("http-status-codes");

/**
 * Validate authorization
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns
 */
const validateAuth = (req, res, next) => {
  try {
    // Check if request has token
    if (!req.headers.authorization)
      return res.status(StatusCodes.FORBIDDEN).json({
        status: "error",
        message: Message(StatusCodes.FORBIDDEN),
      });

    // Get authorization method
    const authMethod = req.headers.authorization.split(" ")[0];

    if (authMethod.toLocaleLowerCase() !== "bearer")
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: `${authMethod} is not allowed`,
      });

    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: Message(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

module.exports = validateAuth;

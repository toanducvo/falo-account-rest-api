const express = require("express");

const { StatusCodes } = require("http-status-codes");

const defaulRole = "user";

/**
 * @description Validate role
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws If role is missing
 * @throws If role is not valid
 * @returns {void}
 */
const validateRole = (req, res, next) => {
  try {
    if (!req.body.role) {
      req.body.role = defaulRole;
    }

    const { role } = req.body;

    if (role !== defaulRole) throw new Error("Invalid role");

    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = validateRole;

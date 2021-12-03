const router = require("express").Router();

const { StatusCodes } = require("http-status-codes");

// Import account handler
const accountController = require("../controllers/account");

const validateHeader = require("../validations/header");
const validatePassword = require("../validations/password");
const validateConfirmPassword = require("../validations/confirm-password");
const validateAuth = require("../validations/auth");

router.post(
  "/change-password",
  validateHeader,
  validateAuth,
  async (req, res, next) => {
    const { oldPassword, password } = req.body;
    if (!oldPassword)
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Old password is required",
      });

    if (oldPassword === password)
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Password cannot be the same as old password",
      });

    next();
  },
  validatePassword,
  validateConfirmPassword,
  accountController.changePassword
);

module.exports = router;

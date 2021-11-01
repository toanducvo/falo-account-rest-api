const router = require("express").Router();

// Import account handler
const accountController = require("../controllers/account");

const validateHeader = require("../validations/header");
const validatePhoneNumber = require("../validations/phone-number");
const validatePassword = require("../validations/password");
const validateConfirmPassword = require("../validations/confirm-password");
const validateFullName = require("../validations/full-name");
const validateGender = require("../validations/gender");
const validateRole = require("../validations/role");
const validateUsername = require("../validations/username");

router.post(
  "/register",
  validateHeader,
  validatePhoneNumber,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
  validateGender,
  validateRole,
  validateUsername,
  accountController.register
);

module.exports = router;

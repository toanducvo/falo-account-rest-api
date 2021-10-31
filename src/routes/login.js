const router = require("express").Router();

// Import account handler
const accountController = require("../controllers/account");

const validatePhoneNumber = require("../validations/phone-number");
const validatePassword = require("../validations/password");

router.post(
  "/login",
  validatePhoneNumber,
  validatePassword,
  accountController.login
);

module.exports = router;

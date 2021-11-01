const router = require("express").Router();

// Import account handler
const accountController = require("../controllers/account");

const validateHeader = require("../validations/header");
const validatePhoneNumber = require("../validations/phone-number");
const validateAuth = require("../validations/auth");

router.post(
  "/delete",
  validateHeader,
  validateAuth,
  validatePhoneNumber,
  accountController.deleteAccount
);

module.exports = router;

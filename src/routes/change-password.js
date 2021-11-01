const router = require("express").Router();

// Import account handler
const accountController = require("../controllers/account");

const validateHeader = require("../validations/header");
const validatePassword = require("../validations/password");
const validateAuth = require("../validations/auth");

router.post(
  "/change-password",
  validateHeader,
  validateAuth,
  validatePassword,
  accountController.changePassword
);

module.exports = router;

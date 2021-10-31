const router = require("express").Router();

const validatePhoneNumber = require("../validations/phone-number");
const validatePassword = require("../validations/password");

router.post("/change-password");

module.exports = router;

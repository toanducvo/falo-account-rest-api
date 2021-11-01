const express = require("express");

const { StatusCodes, getReasonPhrase: Message } = require("http-status-codes");

// Create the router
const router = express.Router();

router.use(require("./routes/register"));
router.use(require("./routes/login"));
router.use(require("./routes/change-password"));
router.use(require("./routes/forgot-password"));
router.use(require("./routes/delete"));

router.use((req, res) => {
  // If request path did not match account path, return 404
  return res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    message: Message(StatusCodes.NOT_FOUND),
  });
});

module.exports = router;

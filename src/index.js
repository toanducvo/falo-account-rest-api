const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: ".env.development" });

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  // Predefined request id
  // Add request id to the request object
  req.header["X-Request-Id"] = uuidv4(); // with uuid v4 generator

  // Add request id to the response object
  res.setHeader("X-Request-Id", req.header["X-Request-Id"]);

  // Next to route
  next();
});

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

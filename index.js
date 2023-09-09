const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

require("./lib/db");
const PORT = 3002;

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

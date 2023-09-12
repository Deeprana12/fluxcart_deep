const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
require('dotenv').config()
const contactRouter = require("./routes/contact.route");

require("./lib/db");
require("./triggers/contact.trigger")?.createTriggers();
const PORT = process.env.PORT

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

app.use("/api", contactRouter);

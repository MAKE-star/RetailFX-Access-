const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const product = require("./product/route");
const trade = require("./trade/route");
const branch = require("./branch/route");
const user = require("./user/route");
const rate = require("./rate/route");
const onboarding = require("./sign-in-up/route");
const smtp = require("./smtp/route");
require("dotenv").config();
const cors = require("cors");

const sequelize = require("./config/database");
require("./models/userProducts");

try {
  sequelize.authenticate();
  sequelize.sync();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

app.use("/healthcheck", require("./healthCheck"));
app.use(product);
app.use(trade);
app.use(branch);
app.use(user);
app.use(rate);
app.use(onboarding);
app.use(smtp);

app.listen(port, () => console.log(`App listening on port ${port}`));

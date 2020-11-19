const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const productsRoute = require("./routes/product");
const usersRoute = require("./routes/user");
const tradesRoute = require("./routes/trade");
const app = express();

// Connect to DB
mongoose
  .connect(
    "mongodb+srv://gil:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.ajxx3.mongodb.net/tradeit?w=majority"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.log(e));

// Ignore/skip the favicon.ico call (workaround)
app.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }

  return next();
});

// Need body parser for post/put calls
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set headers (mainly CORS allow all)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Set the static path for images (External use)
app.use("/images", express.static(path.join("backend/images")));

// Use router
app.use("/api/products", productsRoute);
app.use("/api/users", usersRoute);
app.use("/api/trades", tradesRoute);

module.exports = app;

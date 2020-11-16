const express = require("express");

const app = express();

app.get("/test", (req, res, next) => {
  console.log("test works");
});

module.exports = app;

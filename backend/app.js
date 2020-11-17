const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const path = require("path");
const productsRoute = require("./routes/product");
const app = express();

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

app.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.use("/images", express.static(path.join("backend/images")));

// Products
app.use("/api/products", productsRoute);

// Users
// POST: Create a user
app.post("/api/users", (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      address: req.body.address,
      rating: { value: 0, arrOfRatings: [] },
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({ message: "User saved" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "User could not be saved",
        });
      });
  });
});

// GET: Get all users
app.get("/api/users", async (req, res) => {
  User.find()
    .then((users) => {
      if (!users) {
        return res.status(500).json({ message: "Cannot retrieve users" });
      }
      res.status(200).json({ users });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cannot retrieve users" });
    });
});

app.delete("/api/users", (req, res, next) => {
  User.deleteMany()
    .then((response) => {
      res.status(200).json({ message: "Users deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Cant delete users" });
    });
});

app.post("/api/users/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "Logged in successfuly",
        token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials",
      });
    });
});

module.exports = app;

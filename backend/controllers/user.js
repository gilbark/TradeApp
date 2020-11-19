const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Users
// POST: Create a user
exports.createUser = (req, res, next) => {
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
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        res
          .status(201)
          .json({
            message: "User saved",
            expiresIn: 3600,
            token: token,
            userId: user._id,
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "User could not be saved",
        });
      });
  });
};

// GET: Internal Get all users
exports.getUsers = async (req, res) => {
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
};

// POST: Login
exports.loginUser = (req, res, next) => {
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
};

// DELETE: Internal use, delete users
exports.deleteUsers = (req, res, next) => {
  User.deleteMany()
    .then((response) => {
      res.status(200).json({ message: "Users deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Cant delete users" });
    });
};

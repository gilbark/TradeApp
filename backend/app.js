const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileExtension = require("./middleware/file");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const Product = require("./models/product");
const User = require("./models/user");
const path = require("path");

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
// POST: Create a product
app.post("/products", fileExtension, (req, res, next) => {
  const serverUrl = req.protocol + "://" + req.get("host");
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    images: req.files.map((file) => {
      return serverUrl + "/images/" + file.filename;
    }),
    condition: req.body.condition,
    tags: req.body.tags,
    inTrade: req.body.inTrade,
    owner: req.body.ownerId,
  });
  console.log(product);
  product
    .save()
    .then((result) => {
      res.status(201).json({ message: "Product created" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Unable to create product" });
    });
});

// PUT: Update a product
app.put("/products/:id", fileExtension, (req, res, next) => {
  const serverUrl = req.protocol + "://" + req.get("host");
  const product = {
    title: req.body.title,
    description: req.body.description,
    images: req.files.map((file) => {
      return serverUrl + "/images/" + file.filename;
    }),
    condition: req.body.condition,
    tags: req.body.tags,
    inTrade: req.body.inTrade,
  };
  console.log(product.images);
  Product.updateOne({ _id: req.params.id }, product)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldnt update post",
      });
    });
});

// GET: Get all products
app.get("/products", (req, res, next) => {
  Product.find()
    .populate("owner")
    .exec((err, products) => {
      if (!products) {
        return res.status(500).json({ message: "Unable to retrieve products" });
      }
      res.status(200).json({ products });
    });
});

// GET: Get one product by ID
app.get("/products/:id", (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .populate("owner")
    .exec((err, product) => {
      console.log(product);
      if (!product) {
        return res.status(500).json({ message: "Unable to retrieve product" });
      }
      res.status(200).json({ product });
    });
});

// DELETE: Delete one product by ID
app.delete("/products/:id", async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
    }).then((result) => {
      if (result) {
        return res.status(200).json({ message: "Product deleted" });
      }
    });

    if (!product) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    return res.status(404).send();
  }
});

// DELETE: Delete all products
app.delete("/products", (req, res, next) => {
  Product.deleteMany().then((results) => {
    res.status(200).json({ message: "All products deleted" });
  });
});

// Users
// POST: Create a user
app.post("/users", (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      address: req.body.address,
      rating: req.body.rating,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({ message: "User saved" });
      })
      .catch((err) => {
        res.status(500).json({
          message: "User could not be saved",
        });
      });
  });
});

// GET: Get a user
app.get("/users", async (req, res) => {
  User.find()
    .then((users) => {
      if (!users) {
        return res.status(500).json({ message: "Cannot retrieve users" });
      }
      res.status(200).json({ found });
    })
    .catch((err) => {
      res.status(500).json({ message: "Cannot retrieve users" });
    });
});

module.exports = app;

const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
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
};

exports.updateProduct = (req, res, next) => {
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
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .populate("owner")
    .exec((err, products) => {
      if (!products) {
        return res.status(500).json({ message: "Unable to retrieve products" });
      }
      res.status(200).json({ products });
    });
};

exports.getProductById = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .populate("owner")
    .exec((err, product) => {
      console.log(product);
      if (!product) {
        return res.status(500).json({ message: "Unable to retrieve product" });
      }
      res.status(200).json({ product });
    });
};

exports.deleteProduct = (req, res, next) => {
  try {
    const product = Product.findOneAndDelete({
      _id: req.params.id,
    }).then((result) => {
      if (result) {
        return res.status(200).json({ message: "Product deleted" });
      }
    });

    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    console.log(error);
    return res.status(404).send();
  }
};

exports.deleteAllProducts = (req, res, next) => {
  Product.deleteMany()
    .then((results) => {
      res.status(200).json({ message: "All products deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "Cannot delete all products" });
    });
};

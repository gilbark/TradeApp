const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  // Set server url dynamically
  const serverUrl = req.protocol + "://" + req.get("host");

  // Map product from request body
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
  // Attempt save product
  product
    .save()
    .then((result) => {
      res.status(201).json({ message: "Product created" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Unable to create product" });
    });
};

exports.getMyProducts = (req, res, next) => {
  Product.find({ _id: req.params.id })
    .populate("owner")
    .exec((err, products) => {
      if (!products) {
        return res.status(500).json({ message: "Unable to retrieve products" });
      }

      res.status(200).json({ transformedProducts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Couldn't fetch products" });
    });
};

exports.updateProduct = (req, res, next) => {
  // Set server url dynamically
  const serverUrl = req.protocol + "://" + req.get("host");

  // Map product from request body
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

  // Attempt update product (find by product id and user id from checkAuth middleware -> products can only be updated by the user logged in)
  Product.updateOne({ _id: req.params.id, owner: req.userData.userId }, product)
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
  let query;
  if (req.params.id) {
    query = Product.find({ owner: req.params.id });
  } else {
    query = Product.find();
  }
  // Find and populate the owner on products
  query
    .populate("owner")
    .populate("offers")
    .exec((err, products) => {
      if (!products) {
        return res.status(500).json({ message: "Unable to retrieve products" });
      }
      // Map and transform the products from request

      const transformedProducts = products.map((product) => {
        return {
          condition: product.condition,
          description: product.description,
          images: product.images,
          inTrade: product.inTrade,
          tags: product.tags,
          title: product.title,
          _id: product._id,
          owner: {
            username: product.owner.username,
            _id: product.owner._id,
            rating: product.owner.rating.value,
          },
          offers: product.offers,
        };
      });
      res.status(200).json({ transformedProducts });
    });
};

exports.getProductById = (req, res, next) => {
  // Get one product by ID and populate the owner
  Product.findOne({ _id: req.params.id })
    .populate("owner")
    .exec((err, product) => {
      if (!product) {
        return res.status(500).json({ message: "Unable to retrieve product" });
      }
      const transformedProduct = {
        condition: product.condition,
        description: product.description,
        images: product.images,
        inTrade: product.inTrade,
        tags: product.tags,
        title: product.title,
        _id: product._id,
        owner: {
          username: product.owner.username,
          _id: product.owner._id,
          rating: product.owner.rating.value,
        },
      };
      res.status(200).json({ transformedProduct });
    });
};

exports.deleteProduct = (req, res, next) => {
  // Try deleting the product.
  // Finds the product by product ID and currently logged in user
  try {
    const product = Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.userData.userId,
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
    return res.status(404).send();
  }
};

// INTERNAL USE ONLY
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

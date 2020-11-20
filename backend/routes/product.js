const express = require("express");
const checkAuth = require("../middleware/check-auth");
const ProductController = require("../controllers/product");
const fileExtension = require("../middleware/file");

const router = express.Router();

// POST: Create a product
router.post("", checkAuth, fileExtension, ProductController.addProduct);

// PUT: Update a product
router.put("/:id", checkAuth, fileExtension, ProductController.updateProduct);

// GET: Get all products
router.get("/:id?", ProductController.getProducts);

// GET: Get one product by ID
router.get("/product/:id", ProductController.getProductById);

// router.get("/my/:id", ProductController.getMyProducts);

// DELETE: Delete one product by ID
router.delete("/:id", checkAuth, ProductController.deleteProduct);

// DELETE: Delete all products
router.delete("", checkAuth, ProductController.deleteAllProducts);

module.exports = router;

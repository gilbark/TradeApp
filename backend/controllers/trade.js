const Trade = require("../models/trade");
const Product = require("../models/product");
const User = require("../models/user");

exports.newOffer = (req, res, next) => {
  const trade = new Trade({
    forProduct: req.body.forId,
    offeredProduct: req.body.offeredId,
    confirmedTrade: false,
  });

  Product.findOne({ _id: trade.forProduct }).then((product) => {
    product.offers.push(trade._id);
    product.save().then((result) => {
      console.log(result);
    });
  });

  Product.find().then((res) => console.log(res));
  // Attempt save trade
  trade
    .save()
    .then((result) => {
      res.status(201).json({ trade });
    })
    .catch((err) => {
      res.status(500).json({ message: "Unable to create trade" });
    });
};

exports.cancelOffer = (req, res, next) => {};
exports.getMyOffers = (req, res, next) => {
  // Get my user
  Product.find({
    owner: req.params.id,
  }).then((products) => {
    res.status(200).json({ offers: products });
  });
  // Get my user products
  // For each product ID, check if there's an offer, if so append to response
};
exports.acceptOffer = (req, res, next) => {};

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

  Product.findOne({ _id: trade.offeredProduct }).then((product) => {
    product.offers.push(trade._id);
    product.save().then((result) => {
      product.forProduct = req.body.offeredId;
      product.OfferedProduct = req.body.forId;
      product.save().then((result) => {});
    });
  });

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

exports.acceptOffer = (req, res, next) => {
  let acceptingUserId;
  let offeringUserId;

  Trade.findOneAndUpdate({ _id: req.params.id }, { confirmedTrade: true }).then(
    (trade) => {
      // Accepting userId
      Product.findOneAndUpdate({ _id: trade.forProduct }).then((product) =>
        User.findOne({ _id: product.owner }).then(
          (user) => (acceptingUserId = user._id)
        )
      );

      // Offering userId
      Product.findOneAndUpdate({ _id: trade.offeredProduct }).then((product) =>
        User.findOne({ _id: product.owner }).then(
          (user) => (offeringUserId = user._id)
        )
      );

      // Change the products between the users and reset offers
      // Change the owner of offered product
      Product.findOneAndUpdate(
        { owner: acceptingUserId },
        { owner: offeringUserId, offers: [] }
      ).then((product) => {
        product.save().then((result) => {
          console.log(result);
        });
      });

      // Change the owner of accepted product
      Product.findOneAndUpdate(
        { owner: offeringUserId },
        { owner: acceptingUserId, offers: [] }
      ).then((product) => {
        product.save().then((result) => {
          console.log(result);
        });
      });

      // Save the trade with the updated value
      trade.save();
    }
  );
};

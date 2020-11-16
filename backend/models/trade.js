const mongoose = require("mongoose");

const tradeSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  offeredProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  confirmedTrade: {
    offereProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    tradedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    final: {
      type: Boolean,
      required: true,
    },
  },
});

module.exports = mongoose.model("Trade", tradeSchema);

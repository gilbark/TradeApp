const mongoose = require("mongoose");

const tradeSchema = mongoose.Schema({
  forProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  offeredProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  confirmedTrade: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Trade", tradeSchema);

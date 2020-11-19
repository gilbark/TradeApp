const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  condition: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  inTrade: {
    type: Boolean,
    required: true,
  },
  offers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    secondAddress: {
      type: String,
    },
  },
  rating: {
    value: {
      type: Number,
    },
    arrOfRatings: [
      {
        type: Number,
      },
    ],
  },
  tradesCompleted: {
    type: Number,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

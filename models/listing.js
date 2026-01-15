const { ref } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("../models/review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

 image: {
   url: String,
   filename: String,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;

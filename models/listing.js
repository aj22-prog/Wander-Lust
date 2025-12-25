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
    filename: String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      // This setter ensures that if a plain string URL is provided, it's used correctly
      set: (v) => v === "" ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" : v
    },
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

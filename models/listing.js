const mongoose = require ("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new mongoose.Schema ({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
  filename: String,
  url: {
    type: String,
    default: "https://unsplash.com/photos/gray-fabric-loveseat-near-brown-wooden-table-3wylDrjxH-E"
  }
},

   price: {
  type: Number,
  required: true,
  min: 0
},

    location : String,
    country : String,



});

const Listing = mongoose.model("listing",listingSchema);
module.exports = Listing;
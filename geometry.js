if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("./models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = process.env.ATLASDB_URL||"mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { "geometry.type": { $exists: false } },
    ],
  });

  console.log(`Found ${listings.length} listings missing geometry`);

  for (let listing of listings) {
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: listing.location,
          limit: 1,
        })
        .send();

      if (response.body.features.length === 0) {
        console.log(`No geocode result for: ${listing.title} (${listing.location})`);
        continue;
      }

      listing.geometry = response.body.features[0].geometry;
      await listing.save();
      console.log(`Fixed: ${listing.title}`);
    } catch (err) {
      console.log(`Error fixing ${listing.title}:`, err.message);
    }
  }

  console.log("Done!");
  mongoose.connection.close();
}

main().catch((err) => {
  console.log(err);
});
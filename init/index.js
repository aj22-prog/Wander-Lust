const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const DB_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderLust";

const sampleUsers = [
  { username: "ajay_host", email: "ajay@wanderlust.com", password: "password123" },
  { username: "sophia_stays", email: "sophia@wanderlust.com", password: "password123" },
  { username: "marcus_travels", email: "marcus@wanderlust.com", password: "password123" },
  { username: "elena_explorer", email: "elena@wanderlust.com", password: "password123" },
  { username: "rahul_verma", email: "rahul@wanderlust.com", password: "password123" },
];

const sampleHotels = [
  {
    title: "The Oberoi Udaivilas Luxury Palace",
    description:
      "Spread over 30 acres of landscaped gardens on the banks of Lake Pichola, featuring traditional architecture, serene courtyards, and world-class hospitality.",
    image: {
      filename: "udaivilas",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 32000,
    location: "Udaipur",
    country: "India",
    geometry: {
      type: "Point",
      coordinates: [73.6708, 24.5764],
    },
    reviewsData: [
      { comment: "A truly magical palace stay! The hospitality and views of Lake Pichola are unmatched.", rating: 5 },
      { comment: "Spectacular royal architecture, delicious Rajasthani food, and impeccable service.", rating: 5 },
    ],
  },
  {
    title: "Grand View Alpine Resort & Spa",
    description:
      "Nestled high in the Swiss Alps, offering ski-in/ski-out access, heated infinity pool with mountain views, and cozy fireside chalets.",
    image: {
      filename: "alpine_resort",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 24500,
    location: "Zermatt",
    country: "Switzerland",
    geometry: {
      type: "Point",
      coordinates: [7.7491, 45.9765],
    },
    reviewsData: [
      { comment: "Breathtaking views of the Matterhorn from the balcony! The heated pool is fantastic after skiing.", rating: 5 },
      { comment: "Super cozy rooms, great spa, and very friendly staff.", rating: 4 },
    ],
  },
  {
    title: "Azure Sands Beachfront Resort",
    description:
      "Private overwater villas with glass-bottom floors, infinity plunge pools, and direct access to pristine turquoise coral lagoons.",
    image: {
      filename: "azure_resort",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 45000,
    location: "Male",
    country: "Maldives",
    geometry: {
      type: "Point",
      coordinates: [73.5093, 4.1755],
    },
    reviewsData: [
      { comment: "Paradise on Earth! Snorkeling right from our villa was an unforgettable experience.", rating: 5 },
      { comment: "Top tier dining and incredible sunsets every single evening.", rating: 5 },
    ],
  },
  {
    title: "The Manhattan Skyline Boutique Hotel",
    description:
      "A stylish modern boutique hotel situated in Soho, featuring a rooftop lounge with 360-degree skyline views and designer interiors.",
    image: {
      filename: "manhattan_hotel",
      url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 18500,
    location: "New York",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
    },
    reviewsData: [
      { comment: "Perfect central location for exploring Soho and downtown NYC. The rooftop cocktails are divine.", rating: 4 },
      { comment: "Modern, clean, stylish aesthetic and comfortable beds.", rating: 5 },
    ],
  },
  {
    title: "Kyoto Serenity Ryokan & Onsen",
    description:
      "Experience authentic Japanese hospitality in a historic cedar ryokan featuring private open-air hot spring onsens and traditional kaiseki dining.",
    image: {
      filename: "kyoto_ryokan",
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 21000,
    location: "Kyoto",
    country: "Japan",
    geometry: {
      type: "Point",
      coordinates: [135.7681, 35.0116],
    },
    reviewsData: [
      { comment: "Peaceful and serene. The private onsen under bamboo trees was soothing and relaxing.", rating: 5 },
      { comment: "The multi-course kaiseki dinner was a culinary work of art.", rating: 5 },
    ],
  },
  {
    title: "Santorini Sunset Cliffside Suites",
    description:
      "Perched on the caldera cliffs of Oia with iconic whitewashed terraces, private cave plunge pools, and uninterrupted Aegean Sea sunset views.",
    image: {
      filename: "santorini_suites",
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 28000,
    location: "Oia, Santorini",
    country: "Greece",
    geometry: {
      type: "Point",
      coordinates: [25.3753, 36.4618],
    },
    reviewsData: [
      { comment: "Watching the Oia sunset from our private plunge pool was the highlight of our Europe trip!", rating: 5 },
      { comment: "Immaculate rooms, great breakfast served on the terrace.", rating: 5 },
    ],
  },
  {
    title: "Taj Lake Haven Heritage Palace",
    description:
      "A 250-year-old marble palace appearing to float gracefully on the blue waters, offering heritage suites, peacock courtyards, and royal spa therapies.",
    image: {
      filename: "taj_heritage",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 36000,
    location: "Jaipur",
    country: "India",
    geometry: {
      type: "Point",
      coordinates: [75.7873, 26.9124],
    },
    reviewsData: [
      { comment: "Felt like royalty from check-in to checkout. The evening cultural performances were breathtaking.", rating: 5 },
      { comment: "Stunning architecture, historic charm, and world-class hospitality.", rating: 5 },
    ],
  },
  {
    title: "Bali Rainforest Eco Sanctuary",
    description:
      "Eco-luxury bamboo villas overlooking the lush jungle canopy and rice terraces of Ubud with yoga shalas, organic farm-to-table dining, and river pools.",
    image: {
      filename: "bali_eco",
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 16500,
    location: "Ubud, Bali",
    country: "Indonesia",
    geometry: {
      type: "Point",
      coordinates: [115.2625, -8.5069],
    },
    reviewsData: [
      { comment: "Surrounded by nature and tranquility. The morning yoga sessions and sound healing were life changing.", rating: 5 },
      { comment: "Delicious organic food and gorgeous open-concept villa design.", rating: 4 },
    ],
  },
  {
    title: "Amalfi Coast Villa Belvedere",
    description:
      "Classic Italian coastal villa perched atop lemon-scented cliffs with cascading bougainvillea, private infinity pool, and panoramic vistas of Positano.",
    image: {
      filename: "amalfi_villa",
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 34000,
    location: "Positano, Amalfi Coast",
    country: "Italy",
    geometry: {
      type: "Point",
      coordinates: [14.485, 40.6281],
    },
    reviewsData: [
      { comment: "Unbelievable cliffside views of Positano! The lemon groves and terrace sunsets are unforgettable.", rating: 5 },
      { comment: "Pure Italian romance and exceptional hospitality from the hosts.", rating: 5 },
    ],
  },
  {
    title: "Aurora Borealis Glass Igloos",
    description:
      "Sleep beneath the dancing Northern Lights in heated thermal glass igloos nestled in the snow-covered Arctic pines of Finnish Lapland.",
    image: {
      filename: "lapland_igloos",
      url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    price: 38500,
    location: "Rovaniemi, Lapland",
    country: "Finland",
    geometry: {
      type: "Point",
      coordinates: [25.7289, 66.5039],
    },
    reviewsData: [
      { comment: "We saw the Northern Lights straight from our bed through the glass ceiling! Truly once in a lifetime.", rating: 5 },
      { comment: "Warm, cozy, magical snowy scenery, and great husky safari experience nearby.", rating: 5 },
    ],
  },
];

async function seedDB() {
  try {
    console.log("Connecting to Database at:", DB_URL.replace(/:[^:]*@/, ":****@"));
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    await Review.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing Users, Listings, and Reviews.");

    // 1. Create and Register Users
    const createdUsers = [];
    for (const u of sampleUsers) {
      const newUser = new User({ username: u.username, email: u.email });
      const registeredUser = await User.register(newUser, u.password);
      createdUsers.push(registeredUser);
      console.log(`Registered user: ${u.username} (Password: ${u.password})`);
    }

    // 2. Create Listings and Reviews
    for (let i = 0; i < sampleHotels.length; i++) {
      const hotelData = sampleHotels[i];
      const ownerUser = createdUsers[i % createdUsers.length];

      const newListing = new Listing({
        title: hotelData.title,
        description: hotelData.description,
        image: hotelData.image,
        price: hotelData.price,
        location: hotelData.location,
        country: hotelData.country,
        geometry: hotelData.geometry,
        owner: ownerUser._id,
        reviews: [],
      });

      // Create reviews for this listing with different reviewers
      for (let j = 0; j < hotelData.reviewsData.length; j++) {
        const rev = hotelData.reviewsData[j];
        // Pick an author different from the owner
        const reviewer = createdUsers[(i + j + 1) % createdUsers.length];

        const newReview = new Review({
          comment: rev.comment,
          rating: rev.rating,
          author: reviewer._id,
          createdAt: new Date(Date.now() - (j + 1) * 86400000 * 2), // staggered dates
        });

        await newReview.save();
        newListing.reviews.push(newReview._id);
      }

      await newListing.save();
      console.log(`Created Listing: "${hotelData.title}" (Owner: ${ownerUser.username}, Reviews: ${hotelData.reviewsData.length})`);
    }

    console.log("\nDatabase successfully seeded with new hotel listings, users, and reviews!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

seedDB();

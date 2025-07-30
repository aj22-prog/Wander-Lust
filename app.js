const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}  = require("./schema.js");

// MongoDB Connection
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderLust";
async function main() {
  await mongoose.connect(Mongo_Url);
}
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

const validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  let errMsg = error.details.map((el) => el.message).join(",");
    if(error){
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }

}

// Index route 

app.get(
  "/listing",
  wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", { alllisting });
  })
);

// New route 

app.get("/listing/new", (req, res) => {
  res.render("listing/new");
});

// create route

app.post(
  "/listing", validateListing,
  wrapAsync(async (req, res) => {
    
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  })
);

// Show route 

app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing Not Found");
    res.render("listing/show.ejs", { listing });
  })
);

// Edit route

app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing Not Found");
    res.render("listing/edit", { listing });
  })
);

// Update route

app.put(
  "/listing/:id", validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
  })
);

// Delete Route

app.delete(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  })
);

// Catch-all route for undefined paths

// app.all("*", (req, res,) => {
//   res.send("page not found")
// });

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

// Server Start
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

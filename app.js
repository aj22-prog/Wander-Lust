if(process.env.NODE_ENV != "production"){
  require('dotenv').config();

}

console.log(process.env.SECRET);

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const user = require("./models/user.js");
const { isLoggedIn } = require("./middleware.js");

const ExpressError = require("./utils/ExpressError.js");

const reviewRouter = require("./routes/review.js");
const listingsRouter = require("./routes/listing.js");
const UserRouter = require("./routes/user.js");


const dburl = process.env.ATLASDB_URL;
const store =  MongoStore.create({
   mongoUrl: dburl,
   crypto:{
    secret: process.env.SECRET,
   },
   
   touchAfter:24*3600,
   
});

store.on("error", (err) => {
  console.log("Error in mongo session store ", err);
});

async function main() {
  await mongoose.connect(dburl);
}

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));



// Session configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session & flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Flash & current user middleware (must be after passport.session)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Root route
app.get("/", (req, res) => {
  res.redirect("/listing");
});

// Routes
app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", UserRouter);

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});


// Server start
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


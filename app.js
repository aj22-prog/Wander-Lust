const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const user = require("./models/user.js");
const { isLoggedIn } = require("./middleware.js");

const ExpressError = require("./utils/ExpressError.js");

const reviewRouter = require("./routes/review.js");
const listingsRouter = require("./routes/listing.js");
const UserRouter = require("./routes/user.js");


// Session configuration
const sessionOptions = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// Root route
app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Hi, I am root");
});


// Session & flash middleware
app.use(session(sessionOptions));
app.use(flash());


// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


// Flash & current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  console.log(res.locals.success);
  res.locals.currUser = req.user;
  next();
});


// MongoDB connection
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderLust";

async function main() {
  await mongoose.connect(Mongo_Url);
}

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Global middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


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
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

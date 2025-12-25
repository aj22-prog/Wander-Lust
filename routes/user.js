const express = require("express");
const router = express.Router();

const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware.js");


// Signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});


// Signup logic
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const newUser = new user({ email, username });
      const registeredUser = await user.register(newUser, password);

      console.log(registeredUser);

      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }

        req.flash("success", "User was wanderLust!");
        res.redirect("/listing");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);


// Login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});


// Login logic
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
  }
);


// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "you are logged out!");
    res.redirect("/listing");
  });
});

module.exports = router;

const user = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};


module.exports.signup = async (req, res, next) => {
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
  }

  module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "you are logged out!");
    res.redirect("/listing");
  });
};
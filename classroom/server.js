const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

const sessionOptions = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
  const { name = "anonymous" } = req.query;

  req.flash("success", "User registered successfully!");
  req.session.name = name;

  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.send(`Hello, ${req.session.name}`);
});

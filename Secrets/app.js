//jshint esversion:6
require('dotenv').config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect(process.env.MONGODB_CONNECT);

const userSchema = {
  email: String,
  password: String,
};

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
      .then((foundUser) => {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      })
      .catch((err) => console.log(err));
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser
      .save()
      .then(() => res.render("secrets"))
      .catch((err) => console.log(err));
  });

app.listen(3000, function (req, res) {
  console.log("Server Running at Port 3000");
});

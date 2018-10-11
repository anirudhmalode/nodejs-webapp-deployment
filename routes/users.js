const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load User Model
require("../models/User");
const User = mongoose.model("users");

// user login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// user Register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Login form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords does not match!" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be atleast 4 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // To avoid use of same email_id
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered!");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // Given password is a plain text so have encrypt it using "bcrypt"
        // From bcryptjs doccumentation
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now Registered & you can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Logout User
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully!");
  res.redirect("/users/login");
});

module.exports = router;

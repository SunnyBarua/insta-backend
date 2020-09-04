const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");

const User = mongoose.model("User");
const nodemailer = require("nodemailer");


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
router.get("/", (req, res) => {
  res.send("hello");
});


router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    res.status(422).json({ error: "Please fill up the all fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        res.status(422).json({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic,
        });
        user
          .save()
          .then((user) => {
              res.json({ message: "saved successfully" });
            
            })
             .catch((err) => {
              console.log(err);
         
            
          })
         
      });
    })

    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or Password" });
    }
    bcrypt.compare(password, savedUser.password).then((doMatch) => {
      if (doMatch) {
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
        const { _id, name, email, followers, following, pic } = savedUser;
        res.json({
          token,
          user: { _id, name, email, followers, following, pic },
        });
        console.log(followers);
      } else {
        return res.status(422).json({ error: "Invalid Email or Password" });
      }
    });
  });
});
module.exports = router;

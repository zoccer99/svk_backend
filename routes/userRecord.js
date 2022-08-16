const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const userRoutes = express.Router();

const dbo = require("../db/conn");
const authentification = require("../authentification.js");

dotenv.config();

// This section will help you get a list of all the records. READ
userRoutes.route("/Users").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("Users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

userRoutes.get("/auth",authentification, function (req, res) {
  res.sendStatus(200);
});

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

userRoutes.post("/Users", (req, res) => {
  const userLoggingIn = req.body;
  let db_connect = dbo.getDb();
  db_connect
    .collection("Users")
    .findOne({ username: userLoggingIn.username })
    .then((dbUser) => {
      if (!dbUser) {
        
        return res.json({
          message: "Invalid Username or password!",
        });
      }
      bcrypt
        .compare(userLoggingIn.password, dbUser.password)
        .then((isCorrect) => {
          if (isCorrect) {
            console.log("correct");
            const token = generateAccessToken(dbUser);
            res.status(200).json({accessToken: token});
            // res.cookie("authorization", token, { httpOnly: true,secure: true });
            
            
          } else {
            console.log("false");
            return res.status(403).json({ message: "invalid username or password!" });
          }
        });
    });
});

module.exports = userRoutes;

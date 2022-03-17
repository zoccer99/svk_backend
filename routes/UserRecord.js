const express = require("express");

const userRoutes = express.Router();

const dbo = require("../db/conn");

// This section will help you get a list of all the records.
userRoutes.route("/Users").get(function (req, res) {
    let db_connect = dbo.getDb._db._db_Users("Users");
    db_connect
      .collection("Credentials")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });


  module.exports = userRoutes;
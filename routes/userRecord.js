const express = require("express");

const userRoutes = express.Router();

const dbo = require("../db/conn");

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


  module.exports = userRoutes;
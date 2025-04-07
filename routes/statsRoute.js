const express = require("express");
const dotenv = require("dotenv");

const statsRoutes = express.Router();

const dbo = require("../db/conn");

statsRoutes.route("/playerStats").get((req, res) => {
    console.log("Origin:", req.get("Origin"));
    let db_connect = dbo.getDb();
    db_connect
      .collection("PlayerStats")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });
  
  module.exports = statsRoutes;
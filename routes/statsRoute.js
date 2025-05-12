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

  
  statsRoutes.route("/track-player-click").post((req, res) => {
    const { playerId } = req.body;
  
    if (!playerId) {
      return res.status(400).json({ error: "Kein playerId angegeben" });
    }
  
    const db_connect = dbo.getDb();
  
    // IP holen – falls hinter Proxy, nimm forwarded header
    const ip =
      req.headers["x-forwarded-for"]?.split(",").shift() || req.ip;
  
    const clickEntry = {
      playerId: playerId,
      ip: ip,
      timestamp: new Date(),
    };
  
    db_connect.collection("PlayerClicks").insertOne(clickEntry, (err, result) => {
      if (err) {
        console.error("Fehler beim Speichern des Klicks:", err);
        return res.status(500).json({ error: "Fehler beim Speichern" });
      }
  
      res.status(200).json({ message: "Klick erfasst", insertedId: result.insertedId });
    });
  });
  
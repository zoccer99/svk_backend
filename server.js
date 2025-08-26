const path = require("path")
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: "./config.env" });

app.set("trust proxy", true);

// CORS korrekt konfigurieren
const allowedOrigins = [
  "https://sv-kretzschau.de",
  "https://www.sv-kretzschau.de",          // ← NEU
  "https://svkretzschau.duckdns.org",     // ← NEU
  "http://192.168.2.198:3000",
  "http://localhost:3000"
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("origin", origin)
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

app.use(express.json());
const dbo = require("./db/conn");

// Routen
app.use(require("./routes/record"));
app.use(require("./routes/userRecord"));
app.use(require("./routes/statsRoute"));

app.use(
  "api/images",
  express.static(path.join(__dirname, "api/images"))
);


app.get("/api/images/:album", (req, res) => {
  const album = req.params.album;
  const dirPath = path.join(__dirname, "api/images", album);

  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: "Ordner nicht gefunden" });

    // URLs der Bilder zurückgeben
    const urls = files.map(file => `api/images/${album}/${file}`);
    res.json(urls);
  });
});


const { cronJob, fetchAllPlayers, updateDb } = require("./scraping/fupaPlayerStats");

const port = process.env.PORT || 5000;


app.listen(port, async () => {
  // perform a database connection when server starts
  console.log(`Server is running on port: ${port}`);
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  cronJob.start();
  console.log("🚀 Direktes Ausführen beim Start");
  const players = await fetchAllPlayers();
  updateDb(players);
});

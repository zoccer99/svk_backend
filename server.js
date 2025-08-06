const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: "./config.env" });

app.set("trust proxy", true);

// CORS korrekt konfigurieren
const allowedOrigins = [
  "https://sv-kretzschau.de",
  "http://192.168.2.198:3000"  // Dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

app.use(express.json());

// Routen
app.use(require("./routes/record"));
app.use(require("./routes/userRecord"));
app.use(require("./routes/statsRoute"));

const { cronJob, fetchAllPlayers, updateDb } = require("./scraping/fupaPlayerStats");
const dbo = require("./db/conn");

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

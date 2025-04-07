const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
app.set("trust proxy", true);

app.use(
  cors({
  origin: ["http://localhost:3000", "https://sv-kretzschau.de", "http://192.168.2.198:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin", "x-access-token"],
  credentials: true,
})
);

app.use(express.json());
app.options("*", cors());
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

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
app.set("trust proxy", true);

app.use(
  cors({
    origin: "https://sv-kretzschau.de",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());
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

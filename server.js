const express = require("express");
const app = express();
const cors = require("cors");


require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors({
  //origin: "http://localhost:3000",
  credentials: true,
  
}));
app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/userRecord"));
app.use(require("./routes/statsRoute"));
const scheduler = require("./scraping/fupaPlayerStats")

// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
  scheduler;
});
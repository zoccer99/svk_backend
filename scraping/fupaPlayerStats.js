const fupaIds = require("../data/fupaPlayers.json");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var cron = require("node-cron");
const dbo = require("../db/conn");

const fetchPlayer = async (player) => {
  const playerId = fupaIds[player];
  const queryUrl = "https://api.fupa.net/v1/profiles/" + playerId + "/details";
  var payload = null;
  try {
    console.log(`fetching: ${playerId}`);
    const response = await fetch(queryUrl);
    payload = await response.json();
  } catch (err) {
    console.log(`ERROR: fetching -> ${err}`);
  }
  const matches = payload.playerRole.seasons[0].statistics.matches;
  const goals = payload.playerRole.seasons[0].statistics.goals;
  const assists = payload.playerRole.seasons[0].statistics.assists;
  const playerStats = {
    name: player,
    matches: matches,
    goals: goals,
    assists: assists,
  };
  return playerStats;
};

const fetchAllPlayers = async () => {
  let allPlayers = [];
  for (let player in fupaIds) {
    var stats = await fetchPlayer(player);
    if (stats) allPlayers.push(stats); // nur gültige Spieler
  }
  console.log(allPlayers);
  return allPlayers;
};

const updateDb = (players) => {
  let db_connect = dbo.getDb();
  console.log("hasdila");
  for (let player in players) {
    console.log(players[player]["name"]);
    db_connect.collection("PlayerStats").updateOne(
      { name: players[player].name },
      {
        $set: {
          matches: players[player].matches,
          goals: players[player].goals,
          assists: players[player].assists,
        },
      }
    );
  }
};

module.exports = {
  cronJob: cron.schedule(
    "0 10 * * 1",
    async () => {
      console.log("scraping (Monday 10AM)");
      const players = await fetchAllPlayers();
      updateDb(players);
    },
    {
      scheduled: false,
    }
  ),
  fetchAllPlayers,
  updateDb,
};

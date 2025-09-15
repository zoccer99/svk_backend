const fupaIds = require("../data/fupaPlayers.json");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var cron = require("node-cron");
const dbo = require("../db/conn");
const { logDbAction } = require("../data/logging/logger");

const fetchPlayer = async (player) => {
  const SEASON_YEAR = new Date().getFullYear();
  const NEXT_YEAR = (SEASON_YEAR + 1).toString().slice();
  const playerId = fupaIds[player];
  const queryUrl = "https://api.fupa.net/v1/profiles/" + playerId + "/details";
  var payload = null;
  try {
    logDbAction(`fetching: ${queryUrl}`);
    const response = await fetch(queryUrl);

    payload = await response.json();
  } catch (err) {
    logDbAction(`ERROR: fetching -> ${err}`);
  }

  let season = payload.playerRole?.seasons?.find(
    (s) =>
      s.team &&
      s.team.slug ===
        `sv-kretzschau-m1-${SEASON_YEAR}-${(SEASON_YEAR + 1)    // 2026 -> 26
          .toString()
          .slice(-2)}`
  );

  if (!season) {
    logDbAction(`Keine passende Saison für ${playerId}`);
    return null;
  }

  var stats = season.statistics;

  const matches = stats.matches;
  const goals = stats.goals;
  const assists = stats.assists;
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
  return allPlayers;
};

const updateDb = (players) => {
  let db_connect = dbo.getDb();
  for (let player in players) {
    logDbAction(players[player]["name"]);
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
      logDbAction("PROCESS", "started scraping..");
      const players = await fetchAllPlayers();
      logDbAction("PROCESS", "updating DB..");

      updateDb(players);
      logDbAction("PROCESS", "updated db succesfully");
    },
    {
      scheduled: false,
    }
  ),
  fetchAllPlayers,
  updateDb,
};

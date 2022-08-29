const fupaIds = require("../data/fupaPlayers.json");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var cron = require("node-cron");

const fetchPlayer = async (player) => {
  const playerId = fupaIds[player];
  const queryUrl = "https://api.fupa.net/v1/profiles/" + playerId + "/details";
  const response = await fetch(queryUrl);
  const payload = await response.json();
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
    allPlayers.push(await fetchPlayer(player));
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



cron.schedule("40 10 * * 1", async () => {
  const players = await fetchAllPlayers();
  updateDb(players);
});


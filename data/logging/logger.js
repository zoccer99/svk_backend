const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/db-log.txt");

function logDbAction(action, details) {
  console.log("logging to: ", logFilePath)
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${action}] ${details}\n`;

  fs.appendFile(logFilePath, line, (err) => {
    if (err) {
      console.error("❌ Fehler beim Schreiben ins Log:", err);
    }
  });
}

module.exports = { logDbAction };

const bcrypt = require("bcryptjs");

const password = "aDmin1893";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error("Fehler beim Hashen:", err);
    return;
  }
  console.log("✅ Bcrypt-Hash:", hash);
});
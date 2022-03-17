const { MongoClient } = require("mongodb");
const Db = process.env.DB_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db_Contributions;
let _db_Users;
let _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db_Contributions = db.db("Contributions");
        _db_Users = db.db("Users");
        _db = {
          db_Contributions: _db_Contributions,
          db_Users: _db_Users,
        };
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};

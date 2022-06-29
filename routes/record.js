const express = require("express");
const ObjectId = require('mongodb').ObjectID;

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

//This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/Contribution").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("CContributions")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you create a new record.
recordRoutes.route("/Contribution/add").post(function (req, res) {
  let db_connect = dbo.getDb();
  let myobj = {
    autor: req.body.autor,
    titel: req.body.titel,
    text: req.body.text,
    teamClass: req.body.teamClass,
    category: req.body.category,
    zeit: req.body.zeit,
  };
  db_connect.collection("CContributions").insertOne(myobj, function (err, res) {
    if (err) throw err;
  });
  res.sendStatus(200);
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let myquery = { id: req.body.id };
  let newvalues = {
    $set: {
      person_name: req.body.person_name,
      person_position: req.body.person_position,
      person_level: req.body.person_level,
    },
  };
  db_connect
    .collection("records")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
});

// This section will help you delete a record
recordRoutes.route("/Contribution").delete((req, res) => {
  let db_connect = dbo.getDb();
  var myquery = { _id: req.body._id}
  db_connect.collection("CContributions").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    res.status(200).send("deleted!");
  });
});

module.exports = recordRoutes;

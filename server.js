'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectID;

let app = express();
let db;

app.use(express.static('static'));

/* 
 * Get a list of filtered records
 */
app.get('/api/bugs', function(req, res) {
  console.log("Query string", req.query);
  let filter = {};
  if (req.query.priority)
    filter.priority = req.query.priority;
  if (req.query.status)
    filter.status = req.query.status;

  db.collection("bugs").find(filter).toArray(function(err, docs) {
    res.json(docs);
  });
});

app.use(bodyParser.json());

/*
 * Insert a record
 */
app.post('/api/bugs/', function(req, res) {
  console.log("Req body:", req.body);
  let newBug = req.body;
  db.collection("bugs").insertOne(newBug, function(err, result) {
    if (err) console.log(err);
    let newId = result.insertedId;
    db.collection("bugs").find({_id: newId}).next(function(err, doc) {
      if (err) console.log(err);
      res.json(doc);
    });
  });
});

/*
 * Get a single record
 */
app.get('/api/bugs/:id', function(req, res) {
  db.collection("bugs").findOne({_id: ObjectId(req.params.id)}, function(err, bug) {
    res.json(bug);
  });
});

/*
 * Modify one record, given its ID
 */
app.put('/api/bugs/:id', function(req, res) {
  let bug = req.body;
  // ensure we don't have the _id itself as a field, it's disallowed to modfiy the
  // _id.
  delete (bug._id);
  console.log("Modifying bug:", req.params.id, bug);
  let oid = ObjectId(req.params.id);
  db.collection("bugs").updateOne({_id: oid}, bug, function(err, result) {
    if (err) console.log(err);
    db.collection("bugs").find({_id: oid}).next(function(err, doc) {
      if (err) console.log(err);
      res.send(doc);
    });
  });
});

MongoClient.connect('mongodb://localhost/bugsdb', function(err, dbConnection) {
  db = dbConnection;
  let server = app.listen(3000, function() {
	  let port = server.address().port;
	  console.log("Started server at port", port);
  });
});

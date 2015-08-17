var mongo = require('mongodb').MongoClient;

var url = process.env.MONGODB_URL;

// this is good practice; becomes necessary if we do clustering (multiple node processes; threads on a multiple core processor).
if (!global.db) {
  mongo.connect(url, function(err, db) {
    global.db = db;
  });
}

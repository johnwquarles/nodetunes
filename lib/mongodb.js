var mongo = require('mongodb').MongoClient;

var url = process.env.MONGODB_URL;

if (!global.db) {
  mongo.connect(url, function(err, db) {
    global.db = db;
  });
}

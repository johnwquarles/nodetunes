var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.urlencoded({extended: false}));

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production') {
  require('./lib/secrets');
}

require('./lib/mongodb');

app.locals.maintitle = "NodeTunes";

router
  .get('/', function(req, res) {
    var collection = global.db.collection('artists');
    collection.find().toArray(function(err, artists) {
      var obj = {};
      obj.pagetitle = "All the Artists";
      obj.data = artists;
      res.render('templates/index', obj);
    });
  })

  .get('/new', function(req, res) {
    var obj = {};
    obj.pagetitle = "New Artist";
    res.render('templates/new', obj);
  })

  .post('/new', function(req, res) {
    var collection = global.db.collection('artists');
    collection.save(req.body, function() {
      res.redirect('/');
    });
  })

  .get('/:id/show', function(req, res) {
    var collection = global.db.collection('artists');
    collection.findOne({_id: ObjectId(req.params.id)}, function(err, result) {
      var obj = {};
      obj.pagetitle = result.name;
      obj.artist = result;
      res.render('templates/artist', obj);
    })
  })

  .post('/:id/edit', function(req, res) {
    var collection = global.db.collection('artists');
    collection.update({_id: ObjectId(req.params.id)}, {$set: req.body}, function(err) {
      if (err) {console.log(err);}
      res.redirect("/" + req.params.id + "/show");
    })
  })

  .get('/:id/edit', function(req, res) {
    var collection = global.db.collection('artists');
    collection.findOne({_id: ObjectId(req.params.id)}, function(err, result) {
      var obj = {};
      obj.pagetitle = result.name;
      obj.artist = result;
      res.render('templates/edit', obj);
    })
  })

  .post('/:id/delete', function(req, res) {
    var collection = global.db.collection('artists');
    collection.remove({_id: ObjectId(req.params.id)}, function(err) {
      if (err) {console.log(err);}
      res.redirect('/');
    });
  })

app.use(router);

app
  .use(function (req, res, next) {
    res.status(403).send('Unauthorized');
  })
  .use(function (err, req, res, next) {
    console.log('error', err.stack);
    res.status(500).send("An error has occurred.");
  });

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('nodetunes listening at http://%s:%d', host, port);
});

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.urlencoded({extended: false}));

// NOTE: public is NOT included in the URL!
// go direct to localhost:3000/js to get to js subdirectory.
app.use(express.static('public'));

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
      res.render('templates/artist-index', obj);
    });
  })

  .get('/new', function(req, res) {
    var obj = {};
    obj.pagetitle = "New Artist";
    res.render('templates/artist-new', obj);
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
      res.render('templates/artist-edit', obj);
    })
  })

  .post('/:id/delete', function(req, res) {
    var collection = global.db.collection('artists');
    collection.remove({_id: ObjectId(req.params.id)}, function(err) {
      if (err) {console.log(err);}
      res.redirect('/');
    });
  })

  .get('/album', function(req, res) {
    var albumCollection = global.db.collection('albums');
    var artistCollection = global.db.collection('artists');
    var obj = {};
    obj.data = [];
    obj.pagetitle = "All Albums";
    albumCollection.find().toArray(function(err, albums) {
      albums.forEach(function(album, i) {
        artistCollection.findOne({_id: ObjectId(album.artistId)}, function(err, result) {
          if (err) {console.log(err);}
          album.artist = result.name;
          obj.data.push(album);
          if (i === albums.length - 1) {
            res.render('templates/album-index', obj);
          }
        });
      })
    });
  })

  .get('/album/new', function(req, res) {
    var obj = {};
    obj.pagetitle = "New Album";
    res.render('templates/album-new', obj);
  })

  .post('/album/new', function(req, res) {
    var collection = global.db.collection('albums');
    collection.save(req.body, function() {
      res.redirect('/album');
    });
  })

  .post('/album/:id/delete', function(req, res) {
    console.log("posted");
    var collection = global.db.collection('albums');
    collection.remove({_id: ObjectId(req.params.id)}, function(err) {
      if (err) {console.log(err);}
      res.redirect('/album');
    });
  })

  .get('/artist/search', function(req, res) {
    var artist = req.query.artist;
    var collection = global.db.collection('artists');
    collection.createIndex({name: "text"});
    collection.find({$text: {$search: artist}}).toArray(function(err, results) {
      if (err) {res.send(err);}
      res.send(results);
    })
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

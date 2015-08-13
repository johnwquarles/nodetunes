var express = require('express');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

var app = express();
var router = express.Router();

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
var artistModel = require('./models/artistModel');
var albumModel = require('./models/albumModel');

app.locals.maintitle = "NodeTunes";

router
  .get('/', function(req, res) {
    var obj = artistModel.findAll(function(obj){
      res.render('templates/artist-index', {data: obj, pagetitle: "All the Artists"});
    })
  })

  .get('/new', function(req, res) {
    res.render('templates/artist-new', {pagetitle: "New Artist"});
  })

  .post('/new', function(req, res) {
    var artist = new artistModel(req.body);
    artist.save(function() {
      res.redirect('/');
    });
  })

  .get('/:id/show', function(req, res) {
    artistModel.findArtist(req.params.id, function(artist) {
      res.render('templates/artist', {pagetitle: artist.name, artist: artist});
    })
  })

  .post('/:id/edit', function(req, res) {
    artistModel.findArtist(req.params.id, function(artist) {
      artist.update(req.body, function() {
        res.redirect("/" + req.params.id + "/show");
      })
    })
  })

  .get('/:id/edit', function(req, res) {
    artistModel.findArtist(req.params.id, function(artist) {
      res.render('templates/artist-edit', {pagetitle: artist.name, artist: artist});
    })
  })

  .post('/:id/delete', function(req, res) {
    artistModel.findArtist(req.params.id, function(artist) {
      artist.delete(function() {
        res.redirect('/');
      })
    })
  })

  .get('/search', function(req, res) {
    artistModel.search(req.query.artist, function(arr) {
      res.send(arr);
    })
  })

  .get('/:id/albums', function(req, res) {
    albumModel.getArtistAlbums(req.params.id, function(albums) {
      artistModel.findArtist(req.params.id, function(artist) {
        res.render('templates/artist-albums', {pagetitle: "Albums by " + artist.name, data: albums});
      })
    })
  })

  .get('/album', function(req, res) {
    albumModel.findAll(function(albums) {
      res.render('templates/album-index', {pagetitle: 'All Albums', data: albums});
    })
  })

  .get('/album/new', function(req, res) {
    res.render('templates/album-new', {pagetitle: "New Album"});
  })

  .post('/album/new', function(req, res) {
    var album = new albumModel(req.body);
    album.save(function() {
      res.redirect('/album');
    })
  })

  .post('/album/:id/delete', function(req, res) {
    albumModel.delete(req.params.id, function() {
      res.redirect('/album');
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

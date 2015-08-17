var express = require('express');
var router = express.Router();
var artistModel = require('../models/artistModel');

router
  .get('/', function(req, res) {
    artistModel.findAllForUser(req.session.user._id, function(obj){
      res.render('templates/artist-index', {data: obj, pagetitle: "All the Artists"});
    })
  })

  .get('/new', function(req, res) {
    res.render('templates/artist-new', {pagetitle: "New Artist"});
  })

  .post('/new', function(req, res) {
    req.body.userId = req.session.user._id;
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

  .get('/togglefav', function(req, res) {
    artistModel.findArtist(req.query.id, function(artist) {
      artist.togglefav(function() {
        res.redirect('/');
      })
    })
  })

  .get('/search', function(req, res) {
    artistModel.search(req.query.artist, function(arr) {
      res.send(arr);
    })
  })

module.exports = router;

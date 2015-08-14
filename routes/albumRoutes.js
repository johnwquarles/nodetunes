var express = require('express');
var router = express.Router();
var albumModel = require('../models/albumModel');
var artistModel = require('../models/artistModel');

router
  .get('/:id/albums', function(req, res) {
    albumModel.getArtistAlbums(req.params.id, function(albums) {
      artistModel.findArtist(req.params.id, function(artist) {
        res.render('templates/artist-albums', {pagetitle: "Albums by " + artist.name, data: albums, artistId: artist._id});
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
      res.done();
    })
  })

  .post('/album/:id/delete', function(req, res) {
    albumModel.delete(req.params.id, function() {
      res.redirect('/album');
    })
  })

module.exports = router;

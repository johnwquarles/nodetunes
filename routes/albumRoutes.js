var express = require('express');
var router = express.Router();
var albumModel = require('../models/albumModel');
var artistModel = require('../models/artistModel');

router
  .get('/:id/albums', function(req, res) {
    // user id, artist id, cb
    albumModel.getArtistAlbumsByUser(req.session.user._id, req.params.id, function(albums) {
      artistModel.findArtist(req.params.id, function(artist) {
        res.render('templates/artist-albums', {pagetitle: "Albums by " + artist.name, data: albums, artistId: artist._id});
      })
    })
  })

  .get('/album', function(req, res) {
    albumModel.findAllByUser(req.session.user._id, function(albums) {
      res.render('templates/album-index', {pagetitle: 'All Albums', data: albums});
    })
  })

  .get('/album/new', function(req, res) {
    res.render('templates/album-new', {pagetitle: "New Album"});
  })

  .post('/album/new', function(req, res) {
    req.body.userId = req.session.user._id;
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

module.exports = router;

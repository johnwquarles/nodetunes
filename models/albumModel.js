var _ = require('lodash');
var ObjectId = require('mongodb').ObjectID;
var artistModel = require('./artistModel');

function Albums(obj) {
  this.userId = ObjectId(obj.userId);
  this.artistId = ObjectId(obj.artistId);
  this.name = obj.name;
  this.year = obj.year;
}

Object.defineProperty(Albums, "collection", {
  get: function() {
    return global.db.collection('albums');
  }
})

Albums.findAllByUser = function (_id, cb) {
  var ret_arr = [];
  Albums.collection.find({userId: ObjectId(_id)}).toArray().then(function(albums) {
    if (albums.length === 0) {cb(ret_arr); return;}
    var prototypedAlbums = albums.map(function(album){
      return setPrototype(album);
    })
    prototypedAlbums.forEach(function(prototypedAlbum, i) {
      artistModel.collection.findOne({_id: ObjectId(prototypedAlbum.artistId)})
      .then(function(artist) {
        prototypedAlbum.artist = artist.name;
        ret_arr.push(prototypedAlbum);
        if (i === prototypedAlbums.length - 1) {
          cb(ret_arr);
        }
      })
    })
  }).catch(function(error) {console.log(error);});
}

Albums.getArtistAlbumsByUser = function(userId, artistId, cb) {
  Albums.collection.find({userId: ObjectId(userId), artistId: artistId}).toArray().then(function(albums) {
    cb(albums);
  }).catch(function(error) {console.log(error);});
}

Albums.findAlbum = function(id, cb) {
  Albums.collection.findOne({_id: ObjectId(id)}).then(function(album) {
    cb(setPrototype(album));
  }).catch(function(error) {console.log(error);});
}

Albums.prototype.save = function(cb) {
  Albums.collection.save(this).then(cb())
  .catch(function(error) {console.log(error);});
}

Albums.delete = function(id, cb) {
  Albums.collection.remove({_id: ObjectId(id)}).then(cb())
  .catch(function(error) {console.log(error);});
}

function setPrototype(pojo){
  return _.create(Albums.prototype, pojo);
}

module.exports = Albums;

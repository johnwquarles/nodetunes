var _ = require('lodash');
var ObjectId = require('mongodb').ObjectID;

function Artists(obj) {
  this._id = obj._id;
  this.name = obj.name;
  this.genre = obj.genre;
  this.language = obj.language;
  this.nationality = obj.nationality;
  this.bio = obj.bio;
  this.members = obj.members;
  this.wikipedia = obj.wikipedia;
  this.favorite = obj.favorite;
}

Object.defineProperty(Artists, "collection", {
  get: function() {
    return global.db.collection('artists');
  }
})

Artists.findAll = function (cb) {
  Artists.collection.find().toArray().then(function(artists) {
    var prototypedArtists = artists.map(function(artist){
      return setPrototype(artist);
    })
    cb(prototypedArtists);
  }).catch(function(error) {console.log(error);});
}

Artists.findArtist = function(id, cb) {
  Artists.collection.findOne({_id: ObjectId(id)}).then(function(artist) {
    cb(setPrototype(artist));
  }).catch(function(error) {console.log(error);});
}

Artists.search = function(nameQuery, cb) {
  Artists.collection.createIndex({name: "text"});
  Artists.collection.find({$text: {$search: nameQuery}}).toArray()
  .then(function(arr) {cb(arr);}).catch(function(error) {console.log(error);});
}

Artists.prototype.save = function(cb) {
  Artists.collection.save(this).then(cb())
  .catch(function(error) {console.log(error);});
}

Artists.prototype.update = function(newAttrs, cb) {
  Artists.collection.update({_id: this._id}, {$set: newAttrs}).then(cb())
  .catch(function(error) {console.log(error);});
}

Artists.prototype.delete = function(cb) {
  Artists.collection.remove({_id: this._id}).then(cb())
  .catch(function(error) {console.log(error);});
}

function setPrototype(pojo){
  return _.create(Artists.prototype, pojo);
}

module.exports = Artists;

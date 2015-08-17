var _ = require('lodash');
var bcrypt = require('bcrypt');
//var ObjectId = require('mongodb').ObjectID;

function User(obj) {
  this.username = obj.username;
  this.passwordHash = obj.passwordHash;
}

User.findByUsername = function(username, cb){
  User.collection.findOne({username: username}, function(err, user) {
    cb(err, setPrototype(user));
  })
}

User.login = function(userObj, cb) {
  User.findByUsername(userObj.username, function(err, resultObj) {
    if (resultObj) {
      bcrypt.compare(userObj.password, resultObj.passwordHash, function(err, match) {
        match ? cb(null, setPrototype(resultObj)) : cb("Bad username or password!");
      })
    } else {
      cb("Bad username or password!");
    }
  })
}

User.createUser = function(userObj, cb) {
  // check for passwords matching (pass & confirm);
  // make sure there isn't one already in the database;
  // save username and salted hash to users collection.
  // fire callback

  if (userObj.password !== userObj.passwordConfirm) {
    cb("The passwords provided do not match!");
    return;
  }

  User.findByUsername(userObj.username, function(err, resultObj) {
    if (resultObj.username) {
      cb("A user with this username already exists on the server!");
    } else {
      bcrypt.hash(userObj.password, 8, function(err, hash) {
        userObj.passwordHash = hash;
        var user = new User(userObj);
        user.save(cb);
      })
    }
  })
}

User.prototype.save = function(cb) {
  User.collection.save(this, cb);
}

Object.defineProperty(User, 'collection', {
  get: function () {
    return global.db.collection('user');
  }
})

function setPrototype(pojo) {
  return _.create(User.prototype, pojo);
}

module.exports = User;

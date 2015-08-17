var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');

router
  .get('/logout', function(req, res) {
    req.session.regenerate(function() {
      console.log("Logged out.");
      res.redirect('/login');
    })
  })

  .get('/login', function(req, res) {
    req.session.regenerate(function() {
      res.render('templates/user-login', {pagetitle: "Login", err: null});
    })
  })

  .post('/login', function(req, res) {
    userModel.login(req.body, function(err, userObj) {
      if (err) {res.render('templates/user-login', {pagetitle: "error", err: err}); return;}
      req.session.regenerate(function() {
        req.session.user = userObj;
        console.log("logged in successfully as: " + userObj.username);
        res.redirect('/');
      })
    })
  })

  .get('/new', function(req, res) {
    req.session.regenerate(function() {
      res.render('templates/user-new', {pagetitle: "Create Account", err: null});
    })
  })

  .post('/new', function(req, res) {
    userModel.createUser(req.body, function(err) {
      err ? res.render('templates/user-new', {pagetitle: "Create Account", err: err}): res.redirect('login');
    })
  })

module.exports = router;

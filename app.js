var express = require('express'),
    bodyParser = require('body-parser'),
    ObjectId = require('mongodb').ObjectID,
    session = require('express-session'),
    sassMiddleware = require('node-sass-middleware');

var app = express();

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.urlencoded({extended: false}));

app.use ('/css', sassMiddleware({
  src: './views/sass',
  dest: './public/css',
  debug: true,
  outputStyle: 'expanded'
}));

var artistRoutes = require('./routes/artistRoutes');
var albumRoutes = require('./routes/albumRoutes');
var userRoutes = require('./routes/userRoutes');

if (process.env.NODE_ENV !== 'production') {
  require('./lib/secrets');
}

require('./lib/mongodb');
var artistModel = require('./models/artistModel');
var albumModel = require('./models/albumModel');

app.locals.maintitle = "NodeTunes";

// creates the cookie, I believe. No data is stored on it; all info is server-side in memory,
// but is associated with the cookie id.
app.use(session({
  secret: 'thisisasecretphrase',
  resave: false,
  saveUninitialized: true
}));

// if there is no user already on the req.session (associated with the user's cookie)
// set res.locals.user equal to null so that there's something in there (prevent undefined errors).
// otherwise use same thing as req.session.user.
app.use(function setResLocalsUser(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
})

app.use('/user', userRoutes);

// ------ require login from here ------

app.use(function requireLogin(req, res, next) {
  req.session.user ? next() : res.redirect('/user/login');
})

app.use('/', artistRoutes);
app.use('/', albumRoutes);

// NOTE: public is NOT included in the URL!
// go direct to localhost:3000/js to get to js subdirectory.
app.use(express.static('public'));

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

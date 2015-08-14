var express = require('express');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

var app = express();

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.urlencoded({extended: false}));

var artistRoutes = require('./routes/artistRoutes');
var albumRoutes = require('./routes/albumRoutes');

if (process.env.NODE_ENV !== 'production') {
  require('./lib/secrets');
}

require('./lib/mongodb');
var artistModel = require('./models/artistModel');
var albumModel = require('./models/albumModel');

app.locals.maintitle = "NodeTunes";

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

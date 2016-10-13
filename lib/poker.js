var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var testData = [
  { Name: "session to fgfgfgfplay", CreatedBy: { Name: "Passos" } },
  { Name: "cool", CreatedBy: { Name: "Erik" } }
];

function updateClients(io, data) {
  io.emit('sessions', JSON.stringify(data));
}

function createRoute(io) {
  var sessionRoute = new express.Router();
  sessionRoute.use(cors());
  sessionRoute.use(bodyParser());

  sessionRoute.get('/', function (req, res) {
    console.log(new Date(), 'In list session GET / req.query=', req.query);

    res.json(testData);
  });

  sessionRoute.post('/', function (req, res) {
    console.log(new Date(), 'In hello route POST / req.body=', req.body);

    var session = req.body.session;
    testData.push(session);
    updateClients(io, session);

    res.json({ msg: 'session added' });
  });

  sessionRoute.post('/join', function (req, res) {
    updateClients(io);
  });

  return sessionRoute;
}

module.exports = createRoute;

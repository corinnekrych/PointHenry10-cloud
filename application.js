var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');

// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = ['/poker'];

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/static'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

app.use('/poker', require('./lib/poker.js')(io));

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

http.listen(port, host, function(){
  console.log("App started at: " + new Date() + " on port: " + port);
});
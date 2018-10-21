// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', process.env.PORT || 8080);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

var port = process.env.PORT || 8080;

// Starts the server.
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });

  // remove disconnected player
    socket.on('disconnect', function() {
        delete players[socket.id]
    });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

io.on('connection', function(socket) {

});

//   var lastUpdateTime = (new Date()).getTime();
//   setInterval(function() {
//   // code ...
//   var currentTime = (new Date()).getTime();
//   var timeDifference = currentTime - lastUpdateTime;
//   player.x += 5 * timeDifference;
//   lastUpdateTime = currentTime;
// }, 1000 / 60);
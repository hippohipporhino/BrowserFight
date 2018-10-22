var socket = io();

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
  }
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = true;
        break;
      case 68: // D
        movement.right = true;
        break;
      case 32: // Spacebar
        socket.emit('jump');
        break;
    }
  });
  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = false;
        break;
      case 68: // D
        movement.right = false;
        break;
    }
  });

socket.emit('new player');
console.log('newplayer')
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 400;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 1000, 400);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 20, 0, 2 * Math.PI);
    context.fill();
  }
});
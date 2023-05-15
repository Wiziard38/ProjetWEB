const SocketIO = require('socket.io');
const server = require('../httpserver.js');

const io = SocketIO(server, {
  cors: {
    origin: '*',
  }
});


// What happen on connection
io.on('connection', function (socket) {

  console.log('A user connected to the wrong socket !');
  // Create a new player and add it to our register
  // const p = new Player(socket.id, socket.id)
  // GameManager.addPlayer(12, p);

  socket.disconnect();
  socket.on('disconnect', function () {
    console.log('A user disconnected');
    // Remove the player
    // GameManager.removePlayer(12, p);
  });

});

module.exports = io;
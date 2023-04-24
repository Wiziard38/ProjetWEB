const SocketIO = require('socket.io');
const server = require('../httpserver.js');

const io = SocketIO(server, {
  cors: {
    origin: '*',
  }
});

// const Team = {
//   //Loup garous
//   LG:0,
//   // Humains
//   H: 1,
//   // Morts
//   M: 2
// }

// const Role = {
//   C: 0,
//   I: 1,
//   V: 2,
//   S: 3
// }

// class Player {
//   #playerId;
//   #socketID;
//   #gameID;
//   #team;
//   #role;

//   constructor(playerId, socketId, gameID, team, role) {
//     this.#playerId = playerId;
//     this.#socketID = socketId;
//     this.#gameID = gameID;
//     this.#team = team;
//     this.#role = role;
//   }
//   getId() {
//     return this.#playerId;
//   }
// }



// What happen on connection
io.on('connection', function (socket) {

  console.log('A user connected to the wrong socket !');
  // Create a new player and add it to our register
  //const p = new Player(socket.id, socket.id)
  //GameManager.addPlayer(12, p);

  socket.disconnect();
  socket.on('disconnect', function () {
    console.log('A user disconnected');
    // Remove the player
    //GameManager.removePlayer(12, p);
  });

});

module.exports = io;
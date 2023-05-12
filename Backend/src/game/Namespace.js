const io = require('../ws/websockets.js')
const Game = require('./Game.js')
const Player = require('./Player.js')
const getUserNameByToken = require("../middleware/decode.js");
const usersgames = require('../models/usersgames.js');
const users = require('../models/users.js');

function initNamespace(/** @type {Game} */ game) {
  const gameID = game.getID();
  const GameManager = require('./GameManager.js')
  const namespace = io.of('/' + gameID);
  GameManager.addGame(gameID, game);

  // Middleware use for each new connection to the namespace
  namespace.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    const userName = await GameManager.validUser(token, gameID)
    const username = getUserNameByToken(token);
    // Check if the user is member of the game. If not, close the socket.

    if (await users.findOne({ where: { username: username }, include: { model: usersgames, where: { gameIdGame: gameID } } }) === null) {
      console.log("dec")
      socket.disconnect();
    }
    console.log(username);
    console.log(socket.id);
    console.log("Fin");
    // Que faire dans ce cas ? on deco l'autre utilisateur et on co celui là ?
    // Déco l'ancienne socket ! A FAIRE
    if(game.userAlreadyRegistred(username)) {
      console.log("[Namespace.js] user already connected");
      socket.disconnect();
    }

    // Give the user game_data when loading

    const power = await GameManager.getUserRole(userName, gameID);
    const state = await GameManager.getUserTeam(userName, gameID);

    // Créer des objets
    const player = new Player(socket.id, username, game, state, power);
    // Add the player to the game, it let us find the user with its socket.
    game.addPlayer(player, socket.id);

    // Send all the game data for the player
    const gameData = await game.getGameData(socket.id);
    socket.emit("game_data", gameData);
    // socket.emit("game_data", )
    // TODO DELETE_ALL_TEST_MSG
    socket.emit("info_TEST", username, power.toString(), state.toString())
    next();
  })

  // Function call on connection
  namespace.on('connection', (socket) => {
    // game.setPlayerRoom( socket.id);
    game.setPlayerRoom(socket.id);
    // socket.setTimeout(20000);
    // Géré les multiconnection ?
    // console.log('utilisateur se connecte dans ' + gameID + " avec la socket : " + socket.id);
    socket.on('disconnect', () => {
      // When the user disconnect
      socket.disconnect();
      console.log("user disconnected");
    })
    socket.on("TEST", (mes) => {
      console.log(mes);
    })
    socket.on('message', (mes) => {
      // Fonction utiliser quand l'utilisateur envoie un message dans le chat
      // Il faut vérifier si l'utilisateur à bien le droit de faire cette opération
      // Ajouter le message à la discution si c'est pertinant
      // Il est probable qu'on ait besoin de rajouter d'autres paramètre (en plus de socket)
      // const state = GameManager.states.get(gameID)
      // const role = GameManager.socketToRoom.get(socket.id);
      // const team = GameManager.socketToTeam.get(socket.id);
      // During the day everyone can send and receive message
      /** @type {Player} */
      // io.of(game.getNamespace()).emit("receive_msg", mes);

      const player = game.getPlayerBySocket(socket.id);
      //player.sendMessage(mes);
      game.getGameState().sendMessage(player, mes);
    })

    socket.on('vote', async (username) => {
      // When the player send a vote
      // const state = GameManager.states.get(gameID)
      // const team = GameManager.socketToTeam.get(socket.id);
      // const fromUsername = GameManager.socketDir.get(socket.id);

      // // Savoir si c'est une nouvelle proposition ?
      // if(state == GameState.DAY) {
      //   //  Verifier que le joueur ne vote qu'une seul fois
      //   namespace.emit("vote", fromUsername, username);
      // }
      // else if(state == GameState.NIGHT) {
      //   if(team == Team.WEREWOLF) {
      //     // Vérifier que le joueur vote pour un humain
      //     namespace.to(Team.WEREWOLF).to(Room.CONTAMINATION).emit("vote", fromUsername, username);
      //   }
      // }
    })

    // socket.on('proposal', (username) => {
    //   // When the player send proposal

    //   // Trouver si c'est bien une proposition valide (pas déjà effectuer)
    //   // Notifie les joueurs de ça
    //   const state = GameManager.states.get(gameID)
    //   const team = GameManager.socketToTeam.get(socket.id);
    //   const fromUsername = GameManager.socketDir.get(socket.id);

    //   if(state == GameState.DAY) {
    //     //  Verifier que le joueur ne vote qu'une seul fois
    //     namespace.emit("vote", fromUsername, username);
    //   }
    //   else if(state == GameState.NIGHT) {
    //     if(team == Team.WEREWOLF) {
    //       // Vérifier que le joueur vote pour un humain
    //       namespace.to(Team.WEREWOLF).to(Room.CONTAMINATION).emit("vote", fromUsername, username);
    //     }
    //   }
    // })

    socket.on('contamination', (username) => {
      // When the player contaminate someone 
      // if(GameManager.validRole(socket.id, Room.CONTAMINATION)) {
      //   // Vérifier si le pouvoir a été utilisé deux fois ?
      //   // Placer le joueur cible dans la team des loups garou
      //   // S'il est connecter, changer
      //   userSocketID = GameManager.userToSocket.get(username);
      //   if(userSocketID) {
      //     // Changement de team ici
      //     GameManager.addTeamDirectory(userSocketID, Team.WEREWOLF);
      //     const userSocket = io.of('/' + gameID).sockets.get(userSocketID);
      //     userSocket.join(Team.WEREWOLF);
      //     // Notifie le joueur de la contamination
      //     userSocket.emit("contamination", "bidule");
      //     // Rejoint les loups
      //     // Mettre de la couleur ?
      //   }
      //   namespace.to(Team.WEREWOLF).to(Room.CONTAMINATION).emit("message", username + " is now a werewolf"); 

      // }
    })

    socket.on('spiritism', (username) => {
      // Check if the player have spiritism's role
      // if(GameManager.validRole(socket.id, Room.SPIRITISM)) {

      //   // Vérifier si le username est bien mort



      // }
    })

    socket.on('psychic', (username) => {
      // if(GameManager.validRole(socket.id, Room.PSYCHIC)) {
      //   // get the player role
      //   const playerRole = "";
      //   socket.emit("message", "Le role de " + username + " est " + playerRole)
      // }
    })
  })

}

module.exports = initNamespace;
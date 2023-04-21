const io = require('../ws/websockets.js')

function initNamespace(gameID) {
  const GameManager = require('./GameManager.js')
  const namespace = io.of('/' + gameID);
  namespace.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    const userName = GameManager.validUser(token, gameID)
    // Check if the user is member of the game. If not, close the socket.
    if (userName === null) {
      socket.disconnect();
    }
    // Give the user game_data when loading
    
    const role = await GameManager.getUserRole(userName, gameID);
    const team = await GameManager.getUserTeam(userName, gameID);
    
    
    GameManager.addRoleDirectory(socket.id, role);
    GameManager.addTeamDirectory(socket.id, team);

    //Send all the game data for the player
    socket.emit("game_data", await GameManager.getGameData(gameID, userName));
    next();
  })

  namespace.on('connection', (socket) => {
    console.log('utilisateur se connecte dans ' + gameID);
  })

  namespace.on('disconnect', (socket) => {
    // When the user disconnect
  })

  namespace.on('message', (socket) => {
    //Fonction utiliser quand l'utilisateur envoie un message dans le chat
    //Il faut vérifier si l'utilisateur à bien le droit de faire cette opération
    //Ajouter le message à la discution si c'est pertinant
    //Il est probable qu'on ait besoin de rajouter d'autres paramètre (en plus de socket)
  })

  namespace.on('vote', (socket) => {
    // When the player send a vote message
  })

  namespace.on('proposal', (socket) => {
    // When the player send proposal
  })

  namespace.on('contamination', (socket, name) => {
    // When the player contaminate someone 
  })

  namespace.on('spiritism', (socket, name) => {

  })

  namespace.on('psychic', (socket, name) => {

  })
}

module.exports = initNamespace;
const io = require('../ws/websockets.js')
const Team = require('./Team.js')
const Roles = require('./Roles.js')
const State = require('./State.js')

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
    socket.on('disconnect', () => {
      // When the user disconnect
    })
  
    socket.on('message', (mes) => {
      //Fonction utiliser quand l'utilisateur envoie un message dans le chat
      //Il faut vérifier si l'utilisateur à bien le droit de faire cette opération
      //Ajouter le message à la discution si c'est pertinant
      //Il est probable qu'on ait besoin de rajouter d'autres paramètre (en plus de socket)
      const state = GameManager.states.get(gameID)
  
      //During the day everyone can send and receive message
      if(state === State.DAY) {
        if(team !== Team.DEATH) {
          namespace.emit(mes);
        }
      } else if(state === State.NIGHT) {
        const role = GameManager.socketToRoles(socket.id);
        const team = GameManager.socketToTeam(socket.id);
  
        if(role === Roles.SPIRITISM || role === Roles.ELECTED) {
          // Check if the human can talk to deads
          namespace.to(Roles.ELECTED).to(Roles.SPIRITISM).emit(mes);
          
        } else if(team === Team.WEREWOLF) {
          namespace.to(Team.WEREWOLF).to(Roles.INSOMNIA).emit(mes);
        } else {
          // Truc illégal !
          socket.emit("");
        }
  
      }
    })
  
    socket.on('vote', (username) => {
      // When the player send a vote
    })
  
    socket.on('proposal', (username) => {
      // When the player send proposal
      console.log('test');
      console.log(socket.id);
    })
  
    socket.on('contamination', (username) => {
      // When the player contaminate someone 
      if(GameManager.validRole(socket.id, Roles.CONTAMINATION)) {
        //Vérifier si le pouvoir a été utilisé deux fois ?
      }
    })
  
    socket.on('spiritism', (username) => {
      // Check if the player have spiritism's role
      if(GameManager.validRole(socket.id, Roles.SPIRITISM)) {
        
        // Vérifier si le username est bien mort
        // Faire 
      }
    })
  
    socket.on('psychic', (name) => {
      if(GameManager.validRole(socket.id, Roles.PSYCHIC)) {
        
      }
    })
  })

}

module.exports = initNamespace;
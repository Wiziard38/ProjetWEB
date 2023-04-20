const io = require('../ws/websockets.js')

function initNamespace(gameID) {
  const GameManager = require('./GameManager.js')
  const namespace = io.of('/' + gameID);
  namespace.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // Check if the user is member of the game. If not, close the socket.
    if (GameManager.validUser(token, gameID) === false) {
      socket.disconnect();
    }
    next();
  })

  namespace.on('connection', (socket) => {
    console.log('utilisateur se connecte dans ' + gameID);
  })

  namespace.on('disconnect', (socket) => {
    // TODO supprimer l'user d'ici
  })

  namespace.on('message', (socket) => {
    //Fonction utiliser quand l'utilisateur envoie un message dans le chat
    //Il faut vérifier si l'utilisateur à bien le droit de faire cette opération
    //Ajouter le message à la discution si c'est pertinant
    //Il est probable qu'on ait besoin de rajouter d'autres paramètre (en plus de socket)
  })

  namespace.on('vote', (socket) => {

  })

  namespace.on('proposal', (socket) => {

  })

  namespace.on('contamination', (socket, name) => {

  })

  namespace.on('spiritism', (socket, name) => {

  })

  namespace.on('psychic', (socket, name) => {

  })
}

module.exports = initNamespace;
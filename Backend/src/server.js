/* Pour info, ce point de départ est une adaptation de celui qui vous obtiendriez
en faisant npm create backend
issu du dépôt
<https://github.com/ChoqueCastroLD/create-backend/tree/master/src/template/js>
*/

// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
require('mandatoryenv').load(['PORT'])
const { PORT } = process.env
// Initialize the server
const server = require('./httpserver.js')
// Initialize websockets
const io = require('./ws/websockets.js')
const GameManager = require('./game/GameManager.js')
const Game = require("./game/Game.js")
const game = new Game(1, 7, 5, 5, new Date(), 0.2, 0.3);
// game.create();
GameManager.addGame(game);
// GameManager.createGame('0');
// Instantiate an Express Application
// Open Server on selected Port
// const server = http.createServer(app);
server.listen(
  PORT,
  () => console.info('Server listening   on port ', PORT)
)
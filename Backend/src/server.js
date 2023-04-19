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

// Instantiate an Express Application
// Open Server on selected Port
//const server = http.createServer(app);

server.listen(
  PORT,
  () => console.info('Server listening   on port ', PORT)
)
const app = require('../app')
const request = require('supertest')

describe('POST /signin', () => {
  test('Test if a user can sign in', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ "username": "Lulu", "password": "mdp" })
    expect(response.statusCode).toBe(201)
    //eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE
    expect(response.body.data.token).toBe('eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.body.data.username).toBe('Lulu')
  })

  test('Unable to add Lulu (Already exists)', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ "username": "Lulu", "password": "mdp" })
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Username already exists')
  })

  test('Invalid Password', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ "username": "Lulu", "password": "" })
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Username or password length invalid')
  })

})

describe('GET /whoami', () => {
  test('Lulu asks "whoami ?"', async () => {
    const response = await request(app)
      .get('/whoami')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe(true)
    expect(response.body.username).toBe('Lulu')
    expect(response.body.admin).toBe(false)
  })

  test('No token', async () => {
    const response = await request(app)
      .get('/whoami')
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe("You don't have a token!")
  })

  test('Invalid Token', async () => {
    const response = await request(app)
      .get('/whoami')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.lHVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe("Your token is incorrect.")
  })

})

describe('POST /login', () => {
  test('Lulu try to log in', async () => {
    const response = await request(app)
      .post('/login')
      .send({ "username": "Lulu", "password": "mdp" })
    expect(response.statusCode).toBe(201)
    expect(response.body.data.token).toBe('eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.body.data.username).toBe('Lulu')
    expect(response.body.status).toBe(true)
  })

  test('Lulu try to log in with the wrong password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ "username": "Lulu", "password": "pasbonmotdepasse" })
    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe("Username ou mot de passe incorrect")
    expect(response.body.status).toBe(false)
  })

  test('Lulu try to log in with the wrong username', async () => {
    const response = await request(app)
      .post('/login')
      .send({ "username": "PasLulu", "password": "mdp" })
    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe("Username ou mot de passe incorrect")
    expect(response.body.status).toBe(false)
  })

})

describe('GET /game', () => {
  test('Lulu asks for its games', async () => {
    const response = await request(app)
      .get('/game')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })

})

describe('GET /game/newgame', () => {
  test('Lulu asks to find new games', async () => {
    const response = await request(app)
      .get('/game/newgame')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toEqual(1)
    expect(response.body[0].idGame).toEqual(2)
  })
})

describe('POST /login', () => {
  test('Luca to log in', async () => {
    const response = await request(app)
      .post('/login')
      .send({ "username": "Luca", "password": "nullos" })
    expect(response.statusCode).toBe(201)
    expect(response.body.data.token).toBe('eyJhbGciOiJIUzI1NiJ9.THVjYQ.GiTRCt3k6bdSe11tCcSh_uS8jpqWFzkZmMILNKUzSns')
    expect(response.body.data.username).toBe('Luca')
    expect(response.body.status).toBe(true)
  })
})

describe('GET /game', () => {
  test('Luca asks for its games', async () => {
    const response = await request(app)
      .get('/game')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVjYQ.GiTRCt3k6bdSe11tCcSh_uS8jpqWFzkZmMILNKUzSns')
    expect(response.statusCode).toBe(200)
    expect(response.body[0].idGame).toEqual(1)
  })

})

describe('POST /login', () => {
  test('Jules to log in', async () => {
    const response = await request(app)
      .post('/login')
      .send({ "username": "Jules", "password": "Jule" })
    expect(response.statusCode).toBe(201)
    expect(response.body.data.token).toBe('eyJhbGciOiJIUzI1NiJ9.SnVsZXM.PClrxU9ML9nYVSnbZllFYpWZ8PE08eNPw3iq1MZnu6I')
    expect(response.body.data.username).toBe('Jules')
    expect(response.body.status).toBe(true)
    //expect(response.body.admin).toBe(false)
  })
})


describe('GET /whoami', () => {
  test('Jules asks "whoami ?"', async () => {
    const response = await request(app)
      .get('/whoami')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.SnVsZXM.PClrxU9ML9nYVSnbZllFYpWZ8PE08eNPw3iq1MZnu6I')
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe(true)
    expect(response.body.username).toBe('Jules')
    expect(response.body.admin).toBe(true)
  })
})

describe('POST /game/newgame/2', () => {
  test('Test if a user can sign in', async () => {
    const response = await request(app)
      .post('/game/newgame/2')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(true)
  })
})

// TODO ajouter les tests pour vérifier si tous marche bien pour l'entré dans les parties

describe('DELETE /game/2', () => {
  test('Lulu to delete game 2', async () => {
    const response = await request(app)
      .delete('/game/2')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe("Vous n'êtes pas admin, vous ne pouvez pas supprimer de partie")
  })

  test('Jules to delete game 2', async () => {
    const response = await request(app)
      .delete('/game/2')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.SnVsZXM.PClrxU9ML9nYVSnbZllFYpWZ8PE08eNPw3iq1MZnu6I')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(true)
  })
})

describe('GET /game/newgame', () => {
  test('Lulu asks to find new games after game 2 has been deleted', async () => {
    const response = await request(app)
      .get('/game/newgame')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.tdKET1rEw7Ri6TMMzngo-zEHIvdiME7mcnHvPW7b1uE')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toEqual(0)
  })
})

// const server = require("../server.js");
const Client = require("socket.io-client");
const PORT = 4000;
describe("my awesome project", () => {
  let io, server, serverSocket, clientSocket;

  beforeAll((done) => {
    io = require("../ws/websockets.js")
    server = require('../httpserver.js');
    const Game = require("../game/Game.js")
    const game = new Game(1, 15, 30, 30, new Date(), 0.2, 0.3);
    server.listen(
      PORT,
      () => console.info('Server listening   on port ', PORT)
    )
    io.of('/1').on("connection", (socket) => {
      serverSocket = socket;
    });
    done();
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("Trying to reach the server", (done) => {
    clientSocket = new Client(`http://localhost:${PORT}/1`, {
      auth: {
        token: 'eyJhbGciOiJIUzI1NiJ9.THVjYQ.GiTRCt3k6bdSe11tCcSh_uS8jpqWFzkZmMILNKUzSns',
      },
    });
    clientSocket.emit("message", "mon message");
    clientSocket.on("receive_msg", (msg, username) => {
      expect(msg).toBe("[Server] You cannot send message...");
      expect(username).toBe("Server");
      done();
    });
    // io.of('/1').emit("recu", "Message reçu ?");
  });


});
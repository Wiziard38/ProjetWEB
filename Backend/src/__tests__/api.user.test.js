const app = require('../app')
const request = require('supertest')

describe('GET /users', () => {
  test('Test if get users works with initialized table user', async () => {
    const response = await request(app)
      .get('/bmt/users')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Returning users')
    expect(response.body.data.length).toBe(2)
  })
})

describe('DELETE /users', () => {
  test('Test if all users are deleted', async () => {
    const response = await request(app)
      .delete('/bmt/users')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('All users deleted')
    const listUsers = await request(app)
      .get('/bmt/users')
    expect(listUsers.body.data.length).toBe(0)
  })
})

describe('POST /users', () => {
  test('Test if a user is added', async () => {
    const response = await request(app)
      .post('/bmt/users')
      .send('data={"username": "Lulu"}')
    expect(response.statusCode).toBe(201)
    expect(response.body.message).toBe('User Added')
    expect(response.body.status).toBe(true)
    const listUsers = await request(app)
      .get('/bmt/users')
    expect(listUsers.body.data.length).toBe(1)
  })

  test('Test if a user is not added : lenght = 0', async () => {
    const response = await request(app)
      .post('/bmt/users')
      .send('data={"username": ""}')
    expect(response.statusCode).toBe(304)
    const listUsers = await request(app)
      .get('/bmt/users')
    expect(listUsers.body.data.length).toBe(1)
  })

  test('Test if a user is not added : lenght = 17', async () => {
    const response = await request(app)
      .post('/bmt/users')
      .send('data={"username": "12345678901234567"}')
    expect(response.statusCode).toBe(304)
    const listUsers = await request(app)
      .get('/bmt/users')
    expect(listUsers.body.data.length).toBe(1)
  })
})

describe('GET /getjwtDeleg/:user', () => {
  test('Lulu get the token', async () => {
    await request(app).post('/bmt/users').send('data={"username": "Lulu"}')

    const response = await request(app)
      .get('/bmt/getjwtDeleg/Lulu')
    expect(response.statusCode).toBe(200)
    expect(response.body.token).toBe('eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
  })

  test('InvalidUser do not get the token', async () => {
    const response = await request(app)
      .get('/bmt/getjwtDeleg/InvalidUser')
    expect(response.statusCode).toBe(403)
  })
})
describe('GET /bmt/whoami/', () => {
  test("Someone with Lulu's token ask who he is", async () => {
    const response = await request(app).get('/bmt/whoami').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.body.data).toBe('Lulu')
  })

  test('Someone with unknow token', async () => {
    const response = await request(app).get('/bmt/whoami').set('x-access-token', 'eyJhbGciOiJeUzI1NiJ9.THVsdQ.mAl11oqdfmQGnig_zLxQy_2CVvP6Id1pm2Nt9EqCnP8')
    expect(response.body.data).toBe(undefined)
  })
})

describe('GET /bmt/Lulu/tags', () => {
  test('Lulu ask for its tags', async () => {
    const response = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.body.data.length).toBe(0)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('tags found')
  })
})

describe('GET /bmt/PasLulu/tags', () => {
  test("Pas Lulu ask for its tags with lulu's token", async () => {
    const response = await request(app).get('/bmt/PasLulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('invalid token')
  })
})

describe('POST /bmt/Lulu/tags', () => {
  test('Lulu ask to creat a tag but he did wrong', async () => {
    const response = await request(app).post('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('pasdata={"username": "Lulu"}')
    expect(response.statusCode).toBe(303)
    expect(response.body.message).toBe('invalide request')
    const check = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(check.body.data.length).toBe(0)
  })

  test('Lulu ask to creat a tag with no name argument', async () => {
    const response = await request(app).post('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('data={"noname": "Lulu is here"}')
    expect(response.statusCode).toBe(303)
    expect(response.body.message).toBe('no name for request POST tag')
    const check = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(check.body.data.length).toBe(0)
  })

  test('Lulu ask to creat a tag', async () => {
    const response = await request(app).post('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('data={"name": "Lulu is here"}')
    expect(response.statusCode).toBe(201)
    expect(response.body.message).toBe('Tag added')
    const check = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(check.body.data.length).toBe(1)
  })

  test('Lulu ask to creat the same tag again', async () => {
    const response = await request(app).post('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('data={"name": "Lulu is here"}')
    expect(response.statusCode).toBe(303)
    expect(response.body.message).toBe('Tag already exist')
    const check = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(check.body.data.length).toBe(1)
  })

  test('Lulu ask to creat a tag', async () => {
    const response = await request(app).post('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('data={"name": "Lulu is here again"}')
    expect(response.statusCode).toBe(201)
    expect(response.body.message).toBe('Tag added')
    const check = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(check.body.data.length).toBe(2)
  })
})

describe('GET /bmt/Lulu/tags/id', () => {
  test("Lulu ask for it's tag : Lulu is here", async () => {
    const response = await request(app).get('/bmt/Lulu/tags/4').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('tag found')
    expect(JSON.stringify(response.body.data)).toBe('{"name":"Lulu is here"}')
  })

  test("Lulu ask for it's tag : Lulu is here again", async () => {
    const response = await request(app).get('/bmt/Lulu/tags/5').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('tag found')
    expect(JSON.stringify(response.body.data)).toBe('{"name":"Lulu is here again"}')
  })

  test("Lulu ask for it's tag that do not exist", async () => {
    const response = await request(app).get('/bmt/Lulu/tags/6').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('invalid tag id')
  })
})

describe('PUT /bmt/Lulu/tags/id', () => {
  // Do not test some request as they are already tested before
  test('Lulu ask to modify : Lulu is here to Lulu is here again', async () => {
    const response = await request(app).put('/bmt/Lulu/tags/4').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('data={"name": "Lulu is here again"}')
    expect(response.statusCode).toBe(303)
    expect(response.body.message).toBe('Tag already exist')
  })

  test("Lulu ask for it's modify : Lulu is here to Lulu is here again", async () => {
    const response = await request(app).put('/bmt/Lulu/tags/4').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('data={"name": "Lulu is here again bis"}')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('tag updated')
  })

  test("Lulu ask for it's modify : Lulu is here to Lulu is here again", async () => {
    const response = await request(app).put('/bmt/Lulu/tags/8').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
      .send('data={"name": "Lulu is here again bis"}')
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('invalid tag id')
  })
})

describe('DELETE /bmt/Lulu/tags/id', () => {
  test('Lulu ask to delete : Lulu is here again bis', async () => {
    const response = await request(app).delete('/bmt/Lulu/tags/4').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('tag deleted')

    const check = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(check.body.data.length).toBe(1)
  })

  test('Lulu ask to delete wrong tag', async () => {
    const response = await request(app).delete('/bmt/Lulu/tags/8').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('invalid tag id')

    const check = await request(app).get('/bmt/Lulu/tags').set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.THVsdQ.mAl11oqY9mQGnig_zLxQy_2CVdP6Id1pm2Nt9EqCnP8')
    expect(check.body.data.length).toBe(1)
  })
})

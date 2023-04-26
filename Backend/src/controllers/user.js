const userModel = require("../models/users.js");
const bcrypt = require("bcrypt");
const jws = require("jws");

module.exports = {
  async login(req, res) {
    const { username, password } = req.body;

    // Retrieve user record from database
    const user = await userModel.findOne({ where: { username } });

    if (user) {
      // Compare stored password with input password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Password is correct, generate and return token
        const token = jws.sign(
          {
            header: { alg: "HS256" },
            payload: user.username,
            secret: process.env.JWS_SECRET,
          },
          {
            expiresIn: process.env.JWS_EXPIRES_IN,
          }
        );

        res
          .status(201)
          .json({ status: true, data: { token, username: user.username } });
      } else {
        // Password is incorrect
        res
          .status(401)
          .json({
            status: false,
            message: "Username ou mot de passe incorrect",
          }); // TODO change for security
      }
    } else {
      // User not found
      res
        .status(401)
        .json({ status: false, message: "Username ou mot de passe incorrect" });
    }
  },

  async signin(req, res) {
    const { username, password } = req.body;

    // Verify fields
    if (
      username.length < 1 ||
      username.length > 32 ||
      password.length < 1 ||
      password.length > 60
    ) {
      res.status(401).json({
        status: false,
        message: "Username or password length invalid",
      });
    }

    // check if username already exists
    const user = await userModel.findOne({ where: { username } });

    if (!user) {
      // Add user to database
      const newUser = await userModel.create({
        username,
        password,
      });

      const token = jws.sign(
        {
          header: { alg: "HS256" },
          payload: newUser.username,
          secret: process.env.JWS_SECRET,
        },
        {
          expiresIn: process.env.JWS_EXPIRES_IN,
        }
      );

      res
        .status(201)
        .json({ status: true, data: { token, username: newUser.username } });
    } else {
      res
        .status(401)
        .json({ status: false, message: "Username already exists" });
    }
  },

  async whoami(req, res) {
    const user = req.user;
    // console.log(user);

    if (user != null) {
      res.status(201).json({ status: true, username: user.username });
    } else {
      res.status(401).json({ status: false, message: "No user found" });
    }
  },

  // async getToken (req, res) {
  //   const { user } = req.params
  //   console.log(user)
  //   if (await userModel.findOne({ where: { username: user } }) != null) {
  //     const signature = jws.sign({
  //       header: { alg: 'HS256' },
  //       payload: user,
  //       secret: 'The worst secret ever'
  //     })
  //     console.log(signature)
  //     res.status(200).json({ token: signature })
  //   } else {
  //     res.status(403).json({ status: false, message: 'Username : ' + user + ' is invalid' })
  //   }
  //   // userModel.findOne({ where: {"username": username}})
  // },

  // async whoAmI (req, res) {
  //   console.log('whoami')
  //   res.status(200).json({ data: await tokenAnalyse(req) })
  // },

  // async getUsers (req, res) {
  //   console.log('getting users')
  //   const data = await userModel.findAll({ attributes: ['id', 'username'] })
  //   res.json({ status: true, message: 'Returning users', data })
  // },
  // async deleteUsers (req, res) {
  //   // TODO : verify if the user that wants to update user is an admin (using token...)
  //   // #swagger.tags = ['Users']
  //   // #swagger.summary = 'Delete User'
  //   await userModel.destroy({ where: {} })
  //   res.status(200).json({ message: 'All users deleted' })
  // },
  // async newUser (req, res) {
  //   // #swagger.tags = ['Users']
  //   // #swagger.summary = 'New User'
  //   // #swagger.parameters['obj'] = { in: 'body', description:'Name and email', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!'}}
  //   console.log(req.body)
  //   const jreq = JSON.parse(req.body.data)
  //   // Si 304 pas de retour ?
  //   if (!has(jreq, ['username'])) res.status(304).json()
  //   const { username } = jreq
  //   const size = username.length
  //   if (size < 1 || size > 16) res.status(304).json()
  //   // console.log(req.body)
  //   // if (!validPassword(password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
  //   await userModel.create({ username })
  //   res.status(201).json({ status: true, message: 'User Added' })
  // },
  // async updateUser (req, res) {
  //   // TODO : verify if the user that wants to update this user is an admin or the user himself (using token...)
  //   // #swagger.tags = ['Users']
  //   // #swagger.summary = 'Update User'
  //   // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!'}}
  //   if ((!has(req.body, ['name', 'email', 'password']))) throw new CodeError('You must specify the name, email and password', status.BAD_REQUEST)
  //   const { name, email, password } = req.body
  //   await userModel.update({ name, passhash: await bcrypt.hash(password, 2) }, { where: { email } })
  //   res.json({ status: true, message: 'User updated' })
  // },

  // async listTags (req, res) {
  //   if (await tokenAnalyseUser(req, req.params.user)) {
  //     console.log('user et token valide')
  //     const { dataValues } = await userModel.findOne({ attributes: ['id'], where: { username: req.params.user } })
  //     const { id } = dataValues
  //     console.log('id = ', id)

  //     const data = await tagModel.findAll({ attributes: ['id', 'name'], where: { userId: id } })
  //     res.status(200).json({ message: 'tags found', data })
  //   } else {
  //     res.status(403).json({ message: 'invalid token' })
  //   }
  // },
  // async createTag (req, res) {
  //   console.log('créer un tag')
  //   const { data } = req.body
  //   if (data === undefined) {
  //     res.status(303).json({ message: 'invalide request' })
  //   }
  //   if (await tokenAnalyseUser(req, req.params.user)) {
  //     const { name } = JSON.parse(req.body.data)
  //     // console.log(name)
  //     if (name === undefined) {
  //       res.status(303).json({ message: 'no name for request POST tag' })
  //     }
  //     // cherche l'id de user
  //     const { dataValues } = await userModel.findOne({ attributes: ['id'], where: { username: req.params.user } })
  //     const { id } = dataValues

  //     if (await tagModel.findOne({ where: { userId: id, name: name } }) != null) {
  //       res.status(303).json({ message: 'Tag already exist' })
  //     } else {
  //       const user = await userModel.findOne({ where: { username: req.params.user } })

  //       const tag = await tagModel.create({ name })
  //       user.addTags(tag)

  //       res.status(201).json({ message: 'Tag added' })
  //     }
  //   } else {
  //     res.status(303).json({ message: 'invalid token for user (or user do not exist)' })
  //   }
  // },
  // async getTag (req, res) {
  //   // const { data } = req.body
  //   // if(data == undefined) {
  //   //   res.status(404).json("Invalid request");
  //   // }
  //   if (await tokenAnalyseUser(req, req.params.user)) {
  //     const { dataValues } = await userModel.findOne({ attributes: ['id'], where: { username: req.params.user } })
  //     const { id } = dataValues

  //     const tag = await tagModel.findOne({ attributes: ['name'], where: { userId: id, id: req.params.id } })
  //     if (tag == null) {
  //       res.status(404).json({ message: 'invalid tag id' })
  //     } else {
  //       res.status(200).json({ message: 'tag found', data: tag })
  //     }
  //   }
  //   res.status(403).message({ message: 'invalid token or user not found' })
  // },

  // async editTag (req, res) {
  //   const { data } = req.body
  //   if (data === undefined) {
  //     res.status(403).json({ message: 'Invalid request' })
  //   }
  //   console.log(req.params)
  //   if (await tokenAnalyseUser(req, req.params.user)) {
  //     const { dataValues } = await userModel.findOne({ attributes: ['id'], where: { username: req.params.user } })
  //     const { id } = dataValues

  //     const tag = await tagModel.findOne({ attributes: ['name'], where: { userId: id, id: req.params.id } })
  //     if (tag == null) {
  //       res.status(403).json({ message: 'invalid tag id' })
  //     } else {
  //       if (await tagModel.findOne({ where: { userId: id, name: JSON.parse(data).name } }) != null) {
  //         res.status(303).json({ message: 'Tag already exist' })
  //       } else {
  //         await tagModel.update({ name: JSON.parse(data).name }, { where: { id: req.params.id } })
  //         res.status(200).json({ message: 'tag updated' })
  //       }
  //     }
  //   } else {
  //     res.status(403).json({ message: 'invalid token or user not found' })
  //   }
  // },

  // async deleteTag (req, res) {
  //   if (await tokenAnalyseUser(req, req.params.user)) {
  //     const { dataValues } = await userModel.findOne({ attributes: ['id'], where: { username: req.params.user } })
  //     const { id } = dataValues

  //     const tag = await tagModel.findOne({ attributes: ['name'], where: { userId: id, id: req.params.id } })
  //     if (tag == null) {
  //       res.status(404).json({ message: 'invalid tag id' })
  //     } else {
  //       await tagModel.destroy({ where: { id: req.params.id } })
  //       res.status(200).json({ message: 'tag deleted' })
  //     }
  //   }
  //   res.status(403).message({ message: 'invalid token or user not found' })
  // }
};

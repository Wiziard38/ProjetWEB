const userModel = require("../models/users.js");
const bcrypt = require("bcrypt");
const jws = require("jws");

module.exports = {
  async login(req, res) {
    const { username, password } = req.body;
    // Retrieve user record from database
    const user = await userModel.findOne({ where: { username: username } });

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
    const user = await userModel.findOne({ where: { username: username } });

    if (!user) {
      // Add user to database
      const newUser = await userModel.create({
        username,
        password,
        admin: false
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
    console.log("whoami")
    const user = req.user;
    console.log(user);

    if (user != null) {
      res.status(201).json({ status: true, username: user.username, admin: user.admin });
    } else {
      res.status(401).json({ status: false, message: "No user found" });
    }
  },
};

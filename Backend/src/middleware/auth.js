const usersModel = require("../models/users");
const gamesModel = require("../models/games.js");
const getUserNameByToken = require('./decode.js')

async function verifyToken(req, res, next) {

  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ status: false, token: false, message: "You don't have a token!" });
  }
  try {
    const username = getUserNameByToken(token);
    const user = await usersModel.findOne({ where: { username: username } });
    req.user = user.dataValues;

  } catch (err) {
    return res
      .status(401)
      .json({ status: false, token: false, message: "Your token is incorrect." });
  }
  // console.log("token ok");
  return next();
}



module.exports = verifyToken;

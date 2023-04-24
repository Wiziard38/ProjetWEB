const usersModel = require("../models/users");
const jws = require("jws");

async function verifyToken(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ status: false, token: false, message: "You don't have a token!" });
  }
  try {
    const _ = jws.verify(token, "HS256", process.env.JWS_SECRET);
    const username = jws.decode(token).payload;
    const user = await usersModel.findOne({ where: { username } });

    req.user = user.dataValues;
  } catch (err) {
    return res
      .status(401)
      .json({ status: false, token: false, message: "Your token is incorrect." });
  }
  console.log("token ok");
  return next();
}

module.exports = verifyToken;

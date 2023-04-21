const jws = require("jws");

function verifyToken(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ status: false, token: false, message: "You don't have a token!" });
  }
  try {
    const decoded = jws.verify(token, "HS256", process.env.JWS_SECRET);
    req.user = decoded;
  } catch (err) {
    return res
      .status(401)
      .json({ status: false, token: false, message: "Your token is incorrect." });
  }
  req.body.token = token
  console.log("token ok");
  return next();
}

module.exports = verifyToken;

const jws = require("jws");

function getUserNameByToken(token) {
    jws.verify(token, "HS256", process.env.JWS_SECRET);
    return jws.decode(token).payload;
}

module.exports = getUserNameByToken;
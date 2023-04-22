const status = require("http-status");
const usersModel = require("../models/users.js");
const gamesModel = require("../models/games.js");
const usersgamesModel = require("../models/usersgames.js");
const has = require("has-keys");
const CodeError = require("../util/CodeError.js");
const jws = require("jws");
const { Op } = require("sequelize");

module.exports = {
  async createGame(req, res) {
    const data = req.body;
    console.log(data);
    await gamesModel.create({
      nbJoueur: data.nbJoueur,
      dureeJour: data.dureeJour,
      dureeNuit: data.dureeNuit,
      dateDeb: data.dateDeb,
      probaPouv: data.probaPouv,
      probaLoup: data.probaLoup,
    });
    res.json({ status: true });
  },

  async listMyGames(req, res) {
    console.log("listMyGames");
    try {
      const usernameDecoded = jws.decode(req.headers["x-access-token"]).payload;
      const resAll = await usersgamesModel.findAll({
        where: { username: usernameDecoded },
        attributes: ["idGame"],
      });
      var records = new Array();
      for (let i = 0; i < resAll.length; i++) {
        const record = await gamesModel.findOne({
          where: { idGame: resAll[i].idGame },
        });
        records.push(record);
      }
      res.json(records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async listNewGamesAvailable(req, res) {
    try {
      const usernameDecoded = jws.decode(req.headers["x-access-token"]).payload;
      const allRecords = await gamesModel.findAll();
      var records = new Array();
      for (let i = 0; i < allRecords.length; i++) {
        /* on vérifie que le nombre de participants souhaité n'est pas atteint */
        const nbInscrits = await usersgamesModel.count({
          where: { idGame: allRecords[i].idGame },
        });
        if (nbInscrits < allRecords[i].nbJoueur) {
          /* on vérifie que le joueur n'est pas déjà inscrit dans cette partie */
          const nbInscriptionJoueur = await usersgamesModel.count({
            where: { idGame: allRecords[i].idGame, username: usernameDecoded },
          });
          if (nbInscriptionJoueur == 0) {
            /* on vérifie que la date de début de la partie n'est pas passée */
            const dateActuelle = new Date();
            if (dateActuelle.getTime() < allRecords[i].dateDeb.getTime()) {
              records.push(allRecords[i]);
            }
          }
        }
      }
      res.json(records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async joinNewGame(req, res) {
    console.log("joinNewGame");
    try {
      const usernameDecoded = jws.decode(req.headers["x-access-token"]).payload;
      await usersgamesModel.create({
        username: usernameDecoded,
        idGame: req.params.idGame,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

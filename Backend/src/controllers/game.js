const gamesModel = require("../models/games.js");
const usersgamesModel = require("../models/usersgames.js");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
  async createGame(req, res) {
    console.log("createGame");
    try {
      const data = req.body;
      //console.log(data);
      const game = await gamesModel.create({
        nbJoueur: data.nbJoueur,
        dureeJour: data.dureeJour,
        dureeNuit: data.dureeNuit,
        dateDeb: data.dateDeb,
        probaPouv: data.probaPouv,
        probaLoup: data.probaLoup,
      });
      
      await usersgamesModel.create({
        userIdUser: req.user.idUser,
        gameIdGame: game.idGame,
      });
      res.json({ status: true });
      
      // Création de la partie côté backend
      const Game = require("../game/Game.js");
      new Game(game.idGame, game.nbJoueur, game.dureeJour, game.dureeNuit, game.dateDeb, game.probaPouv, game.probaLoup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },

  async listMyGames(req, res) {
    console.log("listMyGames");
    try {
      // On recupere les parties auxquelles il participe
      const records = await usersgamesModel.findAll({
        where: { userIdUser: req.user.idUser },
        include: [{ model: gamesModel }],
      });
      res.json(records.map((record) => record.game));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },

  async listNewGamesAvailable(req, res) {
    try {
      const games = await gamesModel.findAll({
        include: [
          {
            model: usersgamesModel,
            where: { userIdUser: { [Op.ne]: req.user.idUser } },
            required: false,
          },
        ],
        where: {
          nbJoueur: {
            [Op.gt]: Sequelize.literal(`(
                      SELECT COUNT(*)
                      FROM usersgames
                      WHERE usersgames.gameIdGame = games.idGame
                  )`),
          },
          idGame: {
            [Op.notIn]: Sequelize.literal(`(
                      SELECT gameIdGame
                      FROM usersgames
                      WHERE userIdUser = ${req.user.idUser}
                  )`),
          },
        },
      });

      res.json(games);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },

  async joinNewGame(req, res) {
    console.log("joinNewGame");
    try {
      await usersgamesModel.create({
        gameIdGame: req.params.idGame,
        userIdUser: req.user.idUser,
      });

      res.json({ status: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

const gamesModel = require("../models/games.js");
const usersgamesModel = require("../models/usersgames.js");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
  async createGame(req, res) {
    console.log("createGame");
    try {
      const data = req.body;
      // ajout de la partie dans la base de données
      const game = await gamesModel.create({
        nbJoueur: data.nbJoueur,
        dureeJour: data.dureeJour,
        dureeNuit: data.dureeNuit,
        dateDeb: data.dateDeb,
        probaPouv: data.probaPouv,
        probaLoup: data.probaLoup,
      });
      // le joueur qui crée la partie est ajouté à la partie dans la base de données
      await usersgamesModel.create({
        userIdUser: req.user.idUser,
        gameIdGame: game.idGame,
      });
      res.json({ status: true });
      //Création de la partie côté backend
      const GameManager = require("../game/GameManager.js");
      const Game = require("../game/Game.js");
      const newGame = new Game(game.idGame, game.nbJoueur, game.dureeJour, game.dureeNuit, game.dateDeb, game.probaPouv, game.probaLoup);
      GameManager.addGame(game.idGame, newGame);
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
      // on vérifie que la partie n'est pas complète
      const nbPlayersRegistered = await usersgamesModel.count({ where: {gameIdGame: req.params.idGame } });
      const nbPlayersRequired = await gamesModel.findOne({ attributes: ['nbJoueur'], where: {idGame: req.params.idGame} })
      // un joueur ne peut être qu'une seule fois dans la base de données
      const userAlreadyInGame = await usersgamesModel.findOne({
        where: { gameIdGame: req.params.idGame, userIdUser: req.user.idUser }
      });
      if ((!userAlreadyInGame) && (nbPlayersRegistered < nbPlayersRequired)) {
        await usersgamesModel.create({
          gameIdGame: req.params.idGame,
          userIdUser: req.user.idUser,
        });
      }
      res.json({ status: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

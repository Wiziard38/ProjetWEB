const gamesModel = require("../models/games.js");
const usersgamesModel = require("../models/usersgames.js");
const Sequelize = require("sequelize");
const propositionVoteModel = require("../models/propositionVotes")
const { Op } = require("sequelize");
const users = require("../models/users.js");
const ratifications = require("../models/ratifiacations.js");
module.exports = {
  async createGame(req, res) {
    try {
      const data = req.body;
      //console.log(data);
      const partieCree = await gamesModel.create({
        nbJoueur: data.nbJoueur,
        dureeJour: data.dureeJour,
        dureeNuit: data.dureeNuit,
        dateDeb: data.dateDeb,
        probaPouv: data.probaPouv,
        probaLoup: data.probaLoup,
      });
      
      await usersgamesModel.create({
        userIdUser: req.user.idUser,
        gameIdGame: partieCree.idGame,
      });
      res.json({ status: true });
      
      //Création de la partie !
      // const GameManager = require("../game/GameManager.js");
      const GameManager = require('../game/GameManager.js');
      GameManager.createGame(partieCree.idGame);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  async listRatification(req, res) {
    try {
      const idGame = req.params.idGame;
      const propositions = await propositionVoteModel.findAll({
        include: [
          {model: usersgamesModel, as: "usernameVote", include:{model:users}, where: {gameIdGame: idGame}}
        ]});
      const playersRat = [];
      for (prop of propositions) {
          console.log("prop:",prop);
          playersRat.push({name: prop.usernameVote.user.username, votes: propositionVoteModel.nbVotant || 0});
      }
      res.json({status: true, playersRat: playersRat});
    }
    catch(error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },

  //Fonction pour récupérer la liste des joueurs pouvant être voté
  async listAllPlayerVote(req, res) {
    try {
      const idGame = req.params.idGame;
      const propositions = await propositionVoteModel.findAll({
        include: [
          {model: usersgamesModel, as: "usernameVote", include:{model:users}, where: {gameIdGame: idGame}}
        ]});
      const playersVoted = propositions.map((prop) => (prop.usernameVote.user.username));
      console.log("propositions:", playersVoted);
      const players = await usersgamesModel.findAll({where: {gameIdGame: idGame}, include: {model: users}});  
      const playerAvailable = [];
      for (player of players) {
        if (!(playersVoted.includes(player.user.username))) {
          playerAvailable.push(player.user.username);
        }
      }
      console.log("playerAvailable",playerAvailable)
      res.json({status: true, playersAvailable: playerAvailable});
    }
    catch(error) {
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

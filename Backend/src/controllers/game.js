const gamesModel = require("../models/games.js");
const usersgamesModel = require("../models/usersgames.js");
const Sequelize = require("sequelize");
const propositionVoteModel = require("../models/propositionVotes");
const { Op } = require("sequelize");
const users = require("../models/users.js");
const daytimes = require("../models/daytimes.js");
const games = require("../models/games.js");
const etats = require("../models/etats.js");
const morts = require("../models/morts.js");
const vivants = require("../models/vivants.js");

module.exports = {
  async deleteGame(req, res) {
    const user = req.user;
    const idGame = req.params.idGame;
    if (user.admin) {
      const game = await gamesModel.findOne({ where: { idGame: idGame } });
      console.log(game)
      await game.destroy();
      res.json({ status: true });
    } else {
      res.json({
        status: false,
        message:
          "Vous n'êtes pas admin, vous ne pouvez pas supprimer de partie",
      });
    }
  },

  async createGame(req, res) {
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
        aCommence: true,
      });

      await usersgamesModel.create({
        userIdUser: req.user.idUser,
        gameIdGame: game.idGame,
      });
      res.json({ status: true });

      // Création de la partie côté backend
      
      const Game = require("../game/Game.js");

      new Game(
        game.idGame,
        game.nbJoueur,
        game.dureeJour,
        game.dureeNuit,
        game.dateDeb,
        game.probaPouv,
        game.probaLoup
        );
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
          {
            model: usersgamesModel,
            as: "usernameVote",
            include: { model: users },
            where: { gameIdGame: idGame },
          },
          {model: daytimes, where: {current: true}}
        ],
      });
      const playersRat = [];
      for (prop of propositions) {
        console.log("vote:", prop.usernameVote.user.username);
        console.log("prop votant:", prop.nbVotant);
        playersRat.push({
          name: prop.usernameVote.user.username,
          votes: prop.nbVotant,
        });
      }
      res.json({ status: true, playersRat: playersRat });
    } catch (error) {
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
          {
            model: usersgamesModel,
            as: "usernameVote",
            where: { gameIdGame: idGame },
            include: {model: users}
          },
          {model: daytimes, where: {current: true}}
        ],
      });

      
      let deadPlayers = await morts.findAll({
        include: {model:etats, require: true, include: {model: usersgamesModel, require: true, include: {model: users, required: true}}},
        });
        console.log(deadPlayers)
      deadPlayers = deadPlayers.map(
        (obj) => obj.etat.usersgame.user.username
      );
      console.log("deadPlayers",deadPlayers);
      console.log("prop:", propositions)
      const playersVoted = propositions.map(
        (prop) => prop.usernameVote.user.username
      );
      const players = await usersgamesModel.findAll({
        where: { gameIdGame: idGame },
        include: { model: users },
      });
      const playerAvailable = [];
      for (player of players) {
        console.log(player.user);
        if (!playersVoted.includes(player.user.username) && !deadPlayers.includes(player.user.username)) {
          playerAvailable.push(player.user.username);
        }
      }
      console.log("playerAvailable", playerAvailable);
      res.json({ status: true, playersAvailable: playerAvailable });
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
      // console.log(records);
      // console.log(records.map((record) => record.game));
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

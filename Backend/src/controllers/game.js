const status = require("http-status");
const usersModel = require("../models/users.js");
const gamesModel = require("../models/games.js");
const usersgamesModel = require("../models/usersgames.js");
const has = require("has-keys");
const CodeError = require("../util/CodeError.js");
const jws = require("jws");
const { Op } = require('sequelize');

module.exports = {

  async createGame(req, res) {
    console.log("createGame");
    const data = JSON.parse(req.body.data);
    const date = new Date(
      Date.UTC(
        data.dateDebAnnee,
        data.dateDebMois - 1,
        data.dateDebJour,
        data.HeureDeb,
        data.MinDeb,
        0,
        0,
        ));
      console.log(date);
      console.log(data);
    await gamesModel.create({
        nbJoueur: data.nbJoueur,
        dureeJour: data.dureeJour,
        dureeNuit: data.dureeNuit,
        dateDeb: date,
        probaPouv: data.probaPouv,
        probaLoup: data.probaLoup
    });
    res.json({status: true});
  },

  async listMyGames(req, res) {
    console.log("listMyGames");
    try {
      const usernameDecoded = jws.decode(req.headers['x-access-token']).payload;
      const idGames = await usersgamesModel.findAll({ where: {username: usernameDecoded}, attributes: ['idGame'] });
      console.log(idGames);
      var records = new Array();
      for (var idGame in idGames) {
        console.log(idGame);
        const record = await gamesModel.findOne({ where: {id: idGame} });
        records.push(record);
      }
      console.log(records);
      res.json(records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async listNewGamesAvailable(req, res) {
    // TODO: vérifier si le temps n'est pas écoulé
    // TODO: vérifier le nombre de joueurs déjà inscrits
    // TODO: vérifier que le joueur n'est pas déjà inscrit dans ces parties
    console.log("listNewGamesAvailable");
    try {
      const allRecords = await gamesModel.findAll({ where: {}});
      console.log(allRecords);
      res.json(allRecords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async joinNewGame(req, res) {
    console.log("joinNewGame");
    try {
      const usernameDecoded = jws.decode(req.headers['x-access-token']).payload;
      await usersgamesModel.create({
        username: usernameDecoded,
        idGame: req.params.idGame
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

};

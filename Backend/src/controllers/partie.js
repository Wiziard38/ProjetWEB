const status = require("http-status");
const userModel = require("../models/users.js");
const has = require("has-keys");
const CodeError = require("../util/CodeError.js");
const bcrypt = require("bcrypt");
const jws = require("jws");
const partie = require("../models/partie");

module.exports = {
  async creerPartie(req, res) {
    const data = JSON.parse(req.body.data);
    const date = new Date(
      Date.UTC(
        data.dateDebAnnee,
        data.dateDebMois - 1,
        data.dateDebJour,
        data.HeureDeb,
        data.MinDeb,
        0,
        0));
      console.log(date)
      console.log(data)
    await partie.create({
        nbJoueur: data.nbJoueur,
        dureeJour: data.dureeJour,
        dureeNuit: data.dureeNuit,
        dateDeb: date,
        probaPouv: data.probaPouv,
        probaLoup: data.probaLoup
    });
    res.json({status: true})
  }
};

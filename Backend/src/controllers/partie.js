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
    const date = new Date(Date.UTC(parseInt(data.dateDeb.substring(6,10)),
    parseInt(data.dateDeb.substring(3,5))-1,
    parseInt(data.dateDeb.substring(0,2)),
    parseInt(data.dateDeb.substring(11,13))-1,
    parseInt(data.dateDeb.substring(14,16))-1, 0, 0));
    await partie.create({
        nbJoueur: data.nbJoueur,
        dureeJour: data.dureeJour,
        dureeNuit: data.dureeNuit,
        dateDeb: date,
        probaPouv: data.probaPouv,
        probaLoup: data.probaLoup
    });
    res.json({status: true})
  },
  async listParties(req, res) {
    try {
      const allRecords = await partie.findAll();
      console.log(allRecords)
      res.json(allRecords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

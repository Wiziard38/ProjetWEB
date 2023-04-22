const partie = require("../models/partie");

module.exports = {
  async creerPartie(req, res) {
    const data = req.body;
    console.log(data);
    await partie.create({
      nbJoueur: data.nbJoueur,
      dureeJour: data.dureeJour,
      dureeNuit: data.dureeNuit,
      dateDeb: data.dateDeb,
      probaPouv: data.probaPouv,
      probaLoup: data.probaLoup,
    });
    res.json({ status: true });
  },
  async listParties(req, res) {
    try {
      const allRecords = await partie.findAll();
      res.json(allRecords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

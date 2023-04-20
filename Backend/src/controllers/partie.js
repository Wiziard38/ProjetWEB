const partie = require("../models/partie");

module.exports = {
  async creerPartie(req, res) {
    const data = req.body;
    const date = new Date(
      Date.UTC(
        data.dateDebAnnee,
        data.dateDebMois - 1,
        data.dateDebJour,
        data.HeureDeb,
        data.MinDeb,
        0,
        0
      )
    );
    console.log(data);
    await partie.create({
      nbJoueur: data.nbJoueur,
      dureeJour: data.dureeJour,
      dureeNuit: data.dureeNuit,
      dateDeb: date,
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

const userModel = require("../models/users.js");
const partie = require("../models/partie");

// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require("../models/database.js").sync({ force: true });

  console.log("Base de données créée.");
  await userModel.sync({ force: true });
  // Initialise la base avec quelques données
  await userModel.create({
    username: "luca",
    password: "nullos",
  });

  await userModel.create({
    username: "DarkJL",
    password: "oui",
  });

  await userModel.create({
    username: "1",
    password: "1",
  });

  await userModel.create({
    username: "2",
    password: "2",
  });

  await partie.create({
    id: 1,
    nbJoueur: 7,
    dureeJour: 1,
    dureeNuit: 1,
    dateDeb: "2022-01-17T04:33:12.000Z",
    probaPouv: 0,
    probaLoup: 0,
  });

  await partie.sync({ force: true });

  // Ajouter ici le code permettant d'initialiser par défaut la base de donnée
})();

const usersModel = require("../models/users.js");
const gamesModel = require("../models/games");
const usersgamesModel = require("../models/usersgames");
const discussions = require("../models/discussions");
const etats = require("../models/etats");
const messages = require("../models/messages");
const morts = require("../models/morts");
const propVote = require("../models/propositionVotes");
const ratifications = require("../models/ratifiacations");
const vivants = require("../models/vivants");
// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require("../models/database.js").sync({ force: true });

  console.log("Base de données créée.");
  await usersModel.sync({ force: true });
  await gamesModel.sync({ force: true });
  await usersgamesModel.sync({ force: true });
  await discussions.sync({ force: true });
  await etats.sync({ force: true });
  await messages.sync({ force: true });
  await morts.sync({ force: true });
  await propVote.sync({ force: true });
  await ratifications.sync({ force: true });
  await vivants.sync({ force: true });
  // Initialise la base avec quelques données
  await usersModel.create({
    username: "Luca",
    password: "nullos",
  });

  await usersModel.create({
    username: "DarkJL",
    password: "oui",
  });

  await usersModel.create({
    username: "1",
    password: "1",
  });

  await usersModel.create({
    username: "2",
    password: "2",
  });

  await gamesModel.create({
    nbJoueur: 7,
    dureeJour: 1*3600,
    dureeNuit: 1*3600,
    dateDeb: "2023-01-17T04:33:12.000Z",
    probaPouv: 0,
    probaLoup: 0,
  });

  await gamesModel.create({
    nbJoueur: 8,
    dureeJour: 2*3600,
    dureeNuit: 3*3600 + 1*60,
    dateDeb: "2023-01-17T04:33:13.000Z",
    probaPouv: 0.5,
    probaLoup: 0.5,
  });

  await usersgamesModel.create({
    gameIdGame: 1,
    userIdUser: 3
  });

  await usersgamesModel.create({
    gameIdGame: 1,
    userIdUser: 2
  });


  // Ajouter ici le code permettant d'initialiser par défaut la base de donnée
})();

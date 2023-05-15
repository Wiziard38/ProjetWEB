const io = require("../ws/websockets.js");
const Game = require("./Game.js");
const Player = require("./Player.js");
const getUserNameByToken = require("../middleware/decode.js");
const usersgames = require("../models/usersgames.js");
const users = require("../models/users.js");
const ratifications = require("../models/ratifiacations.js");
const propositionVotes = require("../models/propositionVotes.js");
const games = require("../models/games.js");
const etats = require("../models/etats.js");
const vivants = require("../models/vivants");
const morts = require("../models/morts.js");
function initNamespace(/** @type {Game} */ game) {
  const gameID = game.getID();
  const GameManager = require("./GameManager.js");
  const namespace = io.of("/" + gameID);
  GameManager.addGame(gameID, game);

  // Middleware use for each new connection to the namespace
  namespace.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const userName = await GameManager.validUser(token, gameID);
    const username = getUserNameByToken(token);
    // Check if the user is member of the game. If not, close the socket.

    if (
      (await users.findOne({
        where: { username: username },
        include: { model: usersgames, where: { gameIdGame: gameID } },
      })) === null
    ) {
      console.log("dec");
      socket.disconnect();
      return 0; // ?
    }
    console.log(username);
    console.log(socket.id);
    console.log("Fin");
    // Que faire dans ce cas ? on deco l'autre utilisateur et on co celui là ?
    // Déco l'ancienne socket ! A FAIRE
    if (game.userAlreadyRegistred(username)) {
      console.log("[Namespace.js] user already connected");
      socket.disconnect();
    }

    // Give the user game_data when loading
    const { idUsergame } = await usersgames.findOne({
      attributes: ["idUsergame"],
      include: {
        model: users,
        attributes: [],
        where: { username: username },
      },
      where: { gameIdGame: gameID },
      raw: true,
    });

    // const power = await GameManager.getUserRole(userName, gameID);
    // const state = await GameManager.getUserTeam(userName, gameID);
    const { power, role, spiritisme } = await game.getUserInfos(username);

    console.log("Nouvelles");
    console.log(power);
    console.log(role);
    console.log(spiritisme);
    let playerRole;
    const States = require("./States.js");
    if (role === null) {
      playerRole = States.DEATH;
      if (spiritisme === 1) {
        game.setElected(username);
      }
    } else {
      if (role === "humain") {
        playerRole = States.HUMAN;
      } else {
        playerRole = States.WEREWOLF;
      }
    }
    let playerPower;
    const Powers = require("./Powers.js");
    switch (power) {
      case "spiritisme":
        playerPower = Powers.SPIRITISM;
        break;
      case "insomnie":
        playerPower = Powers.INSOMNIA;
        break;
      case "voyance":
        playerPower = Powers.PSYCHIC;
        break;
      case "contamination":
        playerPower = Powers.CONTAMINATION;
        break;
      default:
        playerPower = Powers.NONE;
    }

    // Créer des objets
    const player = new Player(
      socket.id,
      username,
      game,
      playerRole,
      playerPower,
      idUsergame
    );
    // Add the player to the game, it let us find the user with its socket.
    game.addPlayer(player, socket.id);

    next();
  });

  // Function call on connection
  namespace.on("connection", async (socket) => {
    // game.setPlayerRoom( socket.id);
    game.setPlayerRoom(socket.id);
    socket.on("ask_game_data", async () => {
      await game.getGameData(socket.id);
      await game.sendMessages(socket.id);
    });
    socket.on("supertest", (msg) => {
      console.log(msg);
      socket.emit("messagerecu", "message recu");
    })
    // socket.setTimeout(20000);
    // Géré les multiconnection ?
    // console.log('utilisateur se connecte dans ' + gameID + " avec la socket : " + socket.id);
    socket.on("disconnect", () => {
      // When the user disconnect
      socket.disconnect();
      game.cleanSocket(socket.id);
      console.log("user disconnected");
    });
    socket.on("TEST", (mes) => {
      console.log(mes);
    });
    socket.on("message", async (mes) => {
      // Fonction utiliser quand l'utilisateur envoie un message dans le chat
      // Il faut vérifier si l'utilisateur à bien le droit de faire cette opération
      // Ajouter le message à la discution si c'est pertinant
      // Il est probable qu'on ait besoin de rajouter d'autres paramètre (en plus de socket)
      // const state = GameManager.states.get(gameID)
      // const role = GameManager.socketToRoom.get(socket.id);
      // const team = GameManager.socketToTeam.get(socket.id);
      // During the day everyone can send and receive message
      /** @type {Player} */
      // io.of(game.getNamespace()).emit("receive_msg", mes);

      const player = game.getPlayerBySocket(socket.id);
      //player.sendMessage(mes);
      game.getGameState().sendMessage(player, mes);
    });

    socket.on("propVote", async (userNameVotant, usernameVote) => {
      console.log("Vote recu");
      const usergamesVotant = await usersgames.findOne({
        include: [
          { model: users, where: { username: usernameVotant } },
          { model: etats, include: { model: vivants } },
        ],
      });
      const usergamesVote = await usersgames.findOne({
        include: [
          { model: users, where: { username: usernameVote } },
          { model: etats, include: { model: morts } },
        ],
      });
      if (!game.getPlayerVoted) {
        if (game.isDay()) {
          await propositionVotes.create({
            usernameVotantId: usergamesVotant.idUsergame,
            nbVotant: 1,
            usernameVotantIdUsergame: usergamesVotant.idUsergame,
            usernameVoteId: usergamesVote.idUsergame,
            usernameVoteIdUsergame: usergamesVote.idUsergame,
          });
          socket.emit(
            "receive_msg",
            `Le joueur ${usernameVotant} a voté contre ${usernameVote}`,
            "Serveur"
          );
          socket.broadcast.emit(
            "receive_msg",
            `Le joueur ${usernameVotant} a voté contre ${usernameVote}`,
            "Serveur"
          );
          socket.broadcast.emit("recepVote", usernameVotant, usernameVote);
          socket.emit("recepVote", usernameVotant, usernameVote);
        } else if (usergamesVotant.etat.vivant.typeVivant === "loup-garou") {
          if (!usergamesVote.etat.mort) {
            await propositionVotes.create({
              usernameVotantId: usergamesVotant.idUsergame,
              nbVotant: 1,
              usernameVotantIdUsergame: usergamesVotant.idUsergame,
              usernameVoteId: usergamesVote.idUsergame,
              usernameVoteIdUsergame: usergamesVote.idUsergame,
            });
            socket.emit(
              "receive_msg",
              `Le joueur ${usernameVotant} a voté contre ${usernameVote}`,
              "Serveur"
            );
            socket.broadcast.emit(
              "receive_msg",
              `Le joueur ${usernameVotant} a voté contre ${usernameVote}`,
              "Serveur"
            );
            socket.broadcast.emit("recepVote", usernameVotant, usernameVote);
            socket.emit("recepVote", usernameVotant, usernameVote);
          } else {
            socket.emit(
              "receive_msg",
              `Attention petit tricheur je te vois`,
              "Serveur"
            );
            socket.broadcast.emit(
              "receive_msg",
              `Attention petit tricheur je te vois`,
              "Serveur"
            );
          }
        }
      } else {
        socket.emit(
          "receive_msg",
          "Attention le vote a déjà été décidé, vous ne pouvez plus voter ou ratifier de vote"
        );
      }
    });

    socket.on("ratification", async (usernameVotant, usernameVote) => {
      console.log("ratification recu de ", usernameVotant, "sur", usernameVote);
      if (!game.getPlayerVoted) {
        const usergamesVotant = await usersgames.findOne({
          include: [
            { model: users, where: { username: usernameVotant } },
            { model: etats, include: { model: vivants } },
          ],
        });
        const usergamesVote = await usersgames.findOne({
          include: [{ model: users, where: { username: usernameVote } }],
        });
        if (
          game.isDay() ||
          usergamesVotant.etat.vivant.typeVivant === "loup-garou"
        ) {
          const prop = await propositionVotes.findOne({
            include: {
              model: usersgames,
              as: "usernameVote",
              include: [{ model: users, where: { username: usernameVote } }],
              where: { gameIdGame: game.getID() },
            },
          });
          const tricheur = await ratifications.findOne({
            where: {
              usersgameIdUsergame: usergamesVotant.idUsergame,
              propositionVoteIdProp: prop.idProp,
            },
          });
          const tricheurBis = await propositionVotes.findOne({
            where: {
              usernameVotantIdUsergame: usergamesVotant.idUsergame,
              usernameVoteIdUsergame: usergamesVote.idUsergame,
            },
          });
          console.log(tricheur);
          if (!tricheur && !tricheurBis) {
            await ratifications.create({
              usersgameIdUsergame: usergamesVotant.idUsergame,
              propositionVoteIdProp: prop.idProp,
              etat: false,
            });
            console.log(prop);
            await prop.update({ nbVotant: prop.nbVotant + 1 });
            await prop.save();
            socket.emit(
              "receive_msg",
              `Le joueur ${usernameVotant} a ratifié le vote contre ${usernameVote}`,
              "Serveur"
            );
            socket.broadcast.emit(
              "receive_msg",
              `Le joueur ${usernameVotant} a ratifié le vote contre ${usernameVote}`,
              "Serveur"
            );
            if (prop.nbVotant > game.getNbJoueur() / 2) {
              const usersgameVote = await usersgames.findOne({
                include: [
                  { model: users, where: { username: usernameVote } },
                  { model: etats, include: { model: vivants } },
                ],
                where: {
                  gameIdGame: game.getID(),
                },
              });
              await morts.create({
                eluSpiritisme: false,
                etatId: usersgameVote.etat.etatId,
              });
              console.log(usersgameVote.etat);
              if (usersgameVote.etat.vivant) {
                await usersgameVote.etat.vivant.destroy();
              }
              socket.removeAllListeners("ratification");
              socket.removeAllListeners("propVote");
              socket.emit(
                "receive_msg",
                `Le joueur ${usernameVote} a été désigné à plus de 50%, il est donc éliminé`,
                "Serveur"
              );
              socket.broadcast.emit(
                "receive_msg",
                `Le joueur ${usernameVote} a été désigné à plus de 50%, il est donc éliminé`,
                "Serveur"
              );
            } else {
              socket.emit("recepRat", usernameVote, prop.nbVotant);
              socket.broadcast.emit("recepRat", usernameVote, prop.nbVotant);
            }
          } else {
            socket.emit(
              "receive_msg",
              `Attention petit tricheur je te vois`,
              "Serveur"
            );
          }
        }
      } else {
        socket.emit(
          "receive_msg",
          "Attention le vote a déjà été décidé, vous ne pouvez plus voter ou ratifier de vote"
        );
      }
    });

    socket.on("vote", async (username) => {
      // When the player send a vote
      // const state = GameManager.states.get(gameID)
      // const team = GameManager.socketToTeam.get(socket.id);
      // const fromUsername = GameManager.socketDir.get(socket.id);
      // // Savoir si c'est une nouvelle proposition ?
      // if(state == GameState.DAY) {
      //   //  Verifier que le joueur ne vote qu'une seul fois
      //   namespace.emit("vote", fromUsername, username);
      // }
      // else if(state == GameState.NIGHT) {
      //   if(team == Team.WEREWOLF) {
      //     // Vérifier que le joueur vote pour un humain
      //     namespace.to(Team.WEREWOLF).to(Room.CONTAMINATION).emit("vote", fromUsername, username);
      //   }
      // }
    });

    // socket.on('proposal', (username) => {
    //   // When the player send proposal

    //   // Trouver si c'est bien une proposition valide (pas déjà effectuer)
    //   // Notifie les joueurs de ça
    //   const state = GameManager.states.get(gameID)
    //   const team = GameManager.socketToTeam.get(socket.id);
    //   const fromUsername = GameManager.socketDir.get(socket.id);

    //   if(state == GameState.DAY) {
    //     //  Verifier que le joueur ne vote qu'une seul fois
    //     namespace.emit("vote", fromUsername, username);
    //   }
    //   else if(state == GameState.NIGHT) {
    //     if(team == Team.WEREWOLF) {
    //       // Vérifier que le joueur vote pour un humain
    //       namespace.to(Team.WEREWOLF).to(Room.CONTAMINATION).emit("vote", fromUsername, username);
    //     }
    //   }
    // })

    socket.on("contamination", (username) => {
      // When the player contaminate someone
      // if(GameManager.validRole(socket.id, Room.CONTAMINATION)) {
      //   // Vérifier si le pouvoir a été utilisé deux fois ?
      //   // Placer le joueur cible dans la team des loups garou
      //   // S'il est connecter, changer
      //   userSocketID = GameManager.userToSocket.get(username);
      //   if(userSocketID) {
      //     // Changement de team ici
      //     GameManager.addTeamDirectory(userSocketID, Team.WEREWOLF);
      //     const userSocket = io.of('/' + gameID).sockets.get(userSocketID);
      //     userSocket.join(Team.WEREWOLF);
      //     // Notifie le joueur de la contamination
      //     userSocket.emit("contamination", "bidule");
      //     // Rejoint les loups
      //     // Mettre de la couleur ?
      //   }
      //   namespace.to(Team.WEREWOLF).to(Room.CONTAMINATION).emit("message", username + " is now a werewolf");
      // }
    });

    socket.on("spiritism", (username) => {
      // Check if the player have spiritism's role
      // if(GameManager.validRole(socket.id, Room.SPIRITISM)) {
      //   // Vérifier si le username est bien mort
      // }
    });

    socket.on("psychic", (username) => {
      // if(GameManager.validRole(socket.id, Room.PSYCHIC)) {
      //   // get the player role
      //   const playerRole = "";
      //   socket.emit("message", "Le role de " + username + " est " + playerRole)
      // }
    });
  });
}

module.exports = initNamespace;

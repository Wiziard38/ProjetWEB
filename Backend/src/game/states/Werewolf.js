const io = require('../../ws/websockets');
const Alive = require("./Alive");
const Game = require("../Game");
const discussions = require('../../models/discussions');
const messages = require('../../models/messages');
const daytimes = require('../../models/daytimes');
const propositionVotes = require("../../models/propositionVotes");
const users = require("../../models/users");
const games = require("../../models/games");
const ratifications = require("../../models/ratifiacations");
class Werewolf extends Alive {
  // sendMessage(msg, /** @type {Game}*/game) {
  //     if(super.sendMessage(msg, game) === false) {
  //     if (game.isNight()){
  //             io.of(game.getNamespace()).to(States.WEREWOLF.toString()).to(Powers.INSOMNIA.toString()).emit("receive_msg", mes);
  //             return true;
  //         } else {
  //             // État invalide ?
  //             console.log("[Werewolf.js] sendMessage : Error");
  //             return false;
  //         }

  //     }
  // }
  async sendMessageNight(msg, /** @type {Game} */ game, userName, player) {
    const States = require("../States");
    const Powers = require('../Powers');
    io.of(game.getNamespace()).to(States.WEREWOLF.toString()).to(Powers.INSOMNIA.toString()).emit("receive_msg", msg, userName);

    const { idDiscussion } = await discussions.findOne({
      attributes: ["idDiscussion"],
      where: { date: game.getSwitchTime(), typeDiscussion: "repaire" },
      raw: true
    });

    await messages.create({
      contenu: msg,
      discussionIdDiscussion: idDiscussion,
      usersgameIdUsergame: player.getID()
    })

    return true;
  }

  async voteNuit(game, usernameVote, player) {
      if (!game.getPlayerVoted()) {
          const usergamesVote = await usersgames.findOne({
              include: [
                  { model: users, where: { username: usernameVote } },
                  { model: etats, include: { model: morts } },
              ],
          });
          const currentDaytime = await daytimes.findOne({where: {gameIdGame: game.getID(), current: true}});
          await propositionVotes.create({
              usernameVotantId: player.getID(),
              nbVotant: 1,
              usernameVotantIdUsergame: player.getID(),
              usernameVoteId: usergamesVote.idUsergame,
              daytimeIdDayTime: currentDaytime.idDaytime
            });
            io.of(game.getNamespace()).to(States.WEREWOLF.toString()).to(Powers.INSOMNIA.toString()).emit("receive_msg", `Le joueur ${player.getUsername()} a voté contre ${usernameVote} `, 'Serveur');
            io.of(game.getNamespace()).to(States.WEREWOLF.toString()).to(Powers.INSOMNIA.toString()).emit("recepVote", player.getUsername(), usernameVote);
          }   
      else {
          game.getSocket(player.getSocketId()).emit("receive_msg", "Un joueur a déjà été décidé pour le vote", 'Serveur');
      }
  }

  async ratifNuit(game, usernameVote, player) {
    console.log("ratification recu de ", player.getUsername(), "sur", usernameVote);
    if (!game.getPlayerVoted()) {
        const usergamesVote = await usersgames.findOne({
            include: [
                { model: users, where: { username: usernameVote } },
                { model: games, where: {idGame: game.getID()}}
            ],
        });
        const daytime = daytimes.findOne({include: {model: games, where: {idGame: game.getID()}}, where: {current: true}});
        const prop = await propositionVotes.findOne({
            include: {
              model: usersgames,
              as: "usernameVote",
              include: [
                { model: users, where: { username: usernameVote } },
                {model: daytimes, where: {current: true}}
              ],
              where: { gameIdGame: game.getID() },
            },
          });
        const tricheur = await ratifications.findOne({
            where: {
                usersgameIdUsergame: player.getID(),
                propositionVoteIdProp: prop.idProp,
            },
            include: {model: daytimes, where: {current: true}}
        });
        const tricheurBis = await propositionVotes.findOne({
            where: {
                usernameVotantIdUsergame: player.getID(),
                usernameVoteIdUsergame: usergamesVote.idUsergame,
            },
            include: {model: daytimes, where: {current: true}}
        });
        if (!tricheur && !tricheurBis) {
            await ratifications.create({
              usersgameIdUsergame: player.getID(),
              propositionVoteIdProp: prop.idProp,
              etat: false,
              daytimeIdDaytime: daytime.idDaytime
            });
            await prop.update({ nbVotant: prop.nbVotant + 1 });
            await prop.save();
            io.of(game.getNamespace()).emit("receive_msg", `Le joueur ${player.getUsername()} a ratifié le vote contre ${usernameVote} `, 'Serveur');
            
            if (prop.nbVotant > game.getNbJoueur() / 2) {
              await morts.create({
                eluSpiritisme: false,
                etatId: usergamesVote.etat.etatId,
              });
              if (usergamesVote.etat.vivant) {
                await usergamesVote.etat.vivant.destroy();
              }
              socket.removeAllListeners("ratification");
              socket.removeAllListeners("propVote");
              io.of(game.getNamespace()).emit("receive_msg", `Le joueur ${usernameVote} a été voté a plus de 50% et donc est eliminé `, 'Serveur');
            } else {
                io.of(game.getNamespace()).emit("recepRat", usernameVote, prop.nbVotant);
            }
        } else {
            game.getSocket(player.getSocketId()).emit("receive_msg", 'Attnetion petit tricheur je te vois', 'Serveur');
        }
    }
    else {
        game.getSocket(player.getSocketId()).emit("receive_msg", "Un joueur a déjà été décidé pour le vote", 'Serveur');
    }
  }
}

module.exports = Werewolf;
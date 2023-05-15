const io = require('../../ws/websockets');
const GameManager = require("../GameManager");
const Game = require("../Game.js")
const State = require("./State");
const discussions = require('../../models/discussions');
const messages = require('../../models/messages');
const usersgames = require("../../models/usersgames");
const propositionVotes = require("../../models/propositionVotes");
const users = require("../../models/users");
const etats = require("../../models/etats");
const games = require('../../models/games');
const ratifications = require("../../models/ratifiacations");
const daytimes = require('../../models/daytimes');
const morts = require("../../models/morts");
const vivants = require('../../models/vivants');
class Alive extends State {

    // sendMessage(msg, /** @type {Game} */ game ) {
    //     // const gameState = GameManager.states.get(game);
    //     if (game.isDay()) {
    //         io.of(game.getNamespace()).emit("receive_msg", msg);
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    async sendMessageDay(msg, /** @type {Game} */ game, userName, player) {
        // console.log("[State.js] sendMessageDay : Error");
        io.of(game.getNamespace()).emit("receive_msg", msg, userName);

        const { idDiscussion } = await discussions.findOne({
            attributes: ["idDiscussion"],
            where: { date: game.getSwitchTime() },
            raw: true
        });
        
        await messages.create({
            contenu: msg,
            discussionIdDiscussion: idDiscussion,
            usersgameIdUsergame: player.getID()
        });
        return true;
    }

    async voteJour(game, usernameVote, player) {
        console.log("VoteJour");
        if (!game.getPlayerVoted()) {
            const usergamesVote = await usersgames.findOne({
                include: [
                    { model: users, where: { username: usernameVote } },
                    { model: games, where: {idGame: game.getID()}}
                ],
            });
            const daytime = await daytimes.findOne({include: {model: games, where: {idGame: game.getID()}}, where: {current: true}});
            console.log(daytime);
            await propositionVotes.create({
                usernameVotantId: player.getID(),
                nbVotant: 1,
                usernameVotantIdUsergame: player.getID(),
                usernameVoteId: usergamesVote.idUsergame,
                usernameVoteIdUsergame: usergamesVote.idUsergame,
                daytimeIdDaytime: daytime.idDaytime
                });
            io.of(game.getNamespace()).emit("receive_msg", `Le joueur ${player.getUsername()} a voté contre ${usernameVote} `, 'Serveur');
            io.of(game.getNamespace()).emit("recepVote", player.getUsername(), usernameVote);
            }   
        else {
            game.getSocket(player.getSocketId()).emit("receive_msg", "Un joueur a déjà été décidé pour le vote", 'Serveur');
        }
    }

    async ratifJour(game, usernameVote, player) {
        console.log("ratification recu de ", player.getUsername(), "sur", usernameVote);
        console.log(game.getPlayerVoted());
        if (!game.getPlayerVoted()) {
            const usergamesVote = await usersgames.findOne({
                include: [
                    { model: users, where: { username: usernameVote } },
                    { model: games, where: {idGame: game.getID()}},
                    { model: etats, include: {model: vivants}}
                ],
            });
            const daytime = await daytimes.findOne({include: {model: games, where: {idGame: game.getID()}}, where: {current: true}});
            const prop = await propositionVotes.findOne({
                include: [{
                    model: usersgames,
                    as: "usernameVote",
                    include: [
                        { model: users, where: { username: usernameVote } },
                    ],
                    where: { gameIdGame: game.getID() },
                    },
                    { model: daytimes, where: {current: true}}
                ],
              });
            const tricheur = await ratifications.findOne({
                where: {
                    usersgameIdUsergame: player.getID(),
                    propositionVoteIdProp: prop.idProp,
                },
                include:{ model: daytimes, where: {current: true}}
            });
            const tricheurBis = await propositionVotes.findOne({
                where: {
                    usernameVotantIdUsergame: player.getID(),
                    usernameVoteIdUsergame: usergamesVote.idUsergame,
                },
                include: { model: daytimes, where: {current: true}}
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
                console.log(prop.nbVotant, game.getNbJoueur());
                if (prop.nbVotant > game.getNbJoueur() / 2) {
                    game.setPlayerVoted(true);
                    console.log('etatId', usergamesVote.etat.id);
                    await morts.create({
                        eluSpiritisme: false,
                        etatId: usergamesVote.etat.id,
                    });
                    if (usergamesVote.etat.vivant) {
                        await usergamesVote.etat.vivant.destroy();
                    }
                    io.of(game.getNamespace()).removeAllListeners("ratification");
                    io.of(game.getNamespace()).removeAllListeners("propVote");
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

module.exports = Alive;
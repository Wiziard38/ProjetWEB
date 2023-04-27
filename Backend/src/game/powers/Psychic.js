const Power = require('./Power.js');

/* pouvoir de voyance */
class Psychic extends Power {

    /* remise à zéro du pouvoir voyance lors du passage à la nuit */
    powerReset(username, state) {
        /* requête dans la base de donnée pour remise à zéro du pouvoir */
        // TODO:  à implémenter
    }

    /* afficher tous les villageois (pouvant être sélectionnés) */
    nightInfo(username, state) {
        /* vérifier nuit */
        /* vérifier rôle voyance */
        /* vérifier que le rôle n'est pas encore utilisé */
        /* récupérer dans la base de données tous les villageois */
        /* renvoyer la liste des villageois */
        // TODO: à implémenter
    }

    /* connaître le rôle et les pouvoirs d'un joueur */
    usePower(username, state, selectedUsername) {
        /* vérifier nuit */
        /* vérifier rôle voyance */
        /* vérifier que le rôle n'est pas encore utilisé */
        /* récupérer dans la base de données le rôle et le pouvoir */
        /* notifier utilisation du pouvoir dans la base de données */
        /* renvoyer le rôle et le pouvoir */
        // TODO: à implémenter
    }

}
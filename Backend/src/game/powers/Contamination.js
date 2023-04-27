const Power = require('./Power.js');

/* pouvoir de contamination */
class Contamination extends Power {

    /* remise à zéro du pouvoir contamination lors du passage à la nuit */
    powerReset(username, state) {
        /* requête dans la base de donnée pour remise à zéro du pouvoir */
        // TODO: à implémenter
    }

    /* afficher tous les humains (pouvant être contaminés) */
    infoNuit(username, state) {
        /* vérifier nuit */
        /* vérifier rôle contamination */
        /* vérifier que le rôle n'est pas encore utilisé */
        /* récupérer dans la base de données tous les humains vivants */
        
        /* renvoyer la liste des humains pouvant être contaminés */
        // TODO: à implémenter
    }

    /* transformer un humain en loup-garou */
    usePower(username, state, selectedUsername) {
        /* vérifier nuit */
        /* vérifier rôle contamination */
        /* vérifier que le rôle n'est pas encore utilisé */
        /* vérifier que c'est bien un humain */
        /* modifier dans la base de données le rôle de l'humain en loup-garou */
        /* notifier utilisation du pouvoir dans la base de données */
        /* renovyer un message de confirmation */
        // TODO: à implémenter
    }

}
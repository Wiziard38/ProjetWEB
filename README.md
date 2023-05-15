# Projet LOUP GAROU

Ce projet a été développé dans le cadre des cours d'ACOL et CAWEB à l'ENSIMAG, en deuxième année dans la filière ISI.
Il s'agit d'une application mobile pour un jeu de loup-garou en ligne dans une version modifiée.


## Installation et Lancement

Nous n'avons pas eu le temps de déployer notre projet sous forme d'application mobile (sous forme de package apk).
Nous n'avons pas non plus eu le temps de déployer le serveur de l'application (backend) sur scalingo.

### Installation

1. Clonez le dépôt du projet :
```shell
git clone git@gitlab.com:grenoble-inp-ensimag/4MMCAW6/G1/ProjetACOLWEB/ProjetACOLWEB_camille_colin1_camille_lefevre_jules_fauchon_luca_bitaudeau_mathis_girault.git
```

2. Accédez au répertoire du projet :
```shell
cd ProjetACOLWEB_camille_colin1_camille_lefevre_jules_fauchon_luca_bitaudeau_mathis_girault
```

3. Installez les dépendances :
```shell
cd Frontend
npm install
cd ../Backend
npm install
cd ..
```

### Lancement

4. Lancer l'application (Frontend) :
```shell
cd Frontend
npx expo start
```
Puis suivre les instructions expo qui apparaissent sur le terminal pour ouvrir le projet (scanner un QR code, ou taper sur la touche 'w' pour ouvrir en mode web).

Dans un autre terminal :
```shell
cd Backend
npm run updatedb
npm run startdev
```

La commande updatedb permet d'initialiser la base de donnée, puis la commande startdev permet de lancer le serveur localement.

## Avancement du projet

Nous n'avons pas pu tout finir dans le temps imparti, voici une liste des fonctionnalités que nous n'avons pas pu implémenter :
 - déploiement du Frontend sous forme d'application mobile
 - Une couverture des tests pour le Frontend comme pour le Backend
 - L'implémentation dans le Backend des pouvoirs : Ceux-ci sont présents dans la base de données, ils sont attribués aux joueurs au lancement de la partie, et les différentes actions des pouvoirs sont présentes sur le Frontend. Cependant, nous n'avons pas pu lier le Frontend au Backend, c'est a dire activer l'effet des différents pouvoirs. (A l'exception de l'insomnie qui fonctionne)
 - Gérer l'acces aux archives, a la fois pour les morts et quand la partie est terminée. Le Frontend est présent, les discussions sont bien archivées au niveau de la base de données mais nous n'avons pas eu le temps de récupérer la liste des discussions archivées.
 - La gestion de la fin de partie : quand il n'y a plus qu'un seul type de Villageois (humains ou loup-garou) la partie ne s'arrete pas.
 - 

## Tests

### Frontend
Pour exécuter les tests unitaires pour le Frontend (avec Cypress) :
```shell
cd Frontend
npx cypress run
```
Il faut avoir lancé l'application en mode web au préalable (sé référer au [lancement](#lancement))

### Backend
Des tests pour le Backend ont étés réalisés avec supertest. Pour les lancer :

```shell
cd Backend
npm run test
```

## Auteurs
Mathis Girault
Luca Bitaudeau
Jules Fauchon
Camille Colin
Camille Lefevre

## Licence
Ce projet n'est pas sous licence.

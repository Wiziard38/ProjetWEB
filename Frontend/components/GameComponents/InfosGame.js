import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import SizedText from "../SizedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secondsToText, dateToText } from "../../utils/dateFunctions";

export default function InfosGame() {
  const [game, setGame] = useState(null);
  const [gameDetails, setGameDetails] = useState([]);
  const [role, setRole] = useState(null);
  const [listeJoueurs, setListeJoueurs] = useState([]);
  const [pouvoir, setPouvoir] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup les infos de la partie de idGame {idGame}
      setGame({
        createdAt: "2023-04-27T08:19:34.987Z",
        dateDeb: "2023-01-17T04:33:12.000Z",
        dureeJour: 3600,
        dureeNuit: 3600,
        idGame: 1,
        nbJoueur: 7,
        probaLoup: 0,
        probaPouv: 0,
        updatedAt: "2023-04-27T08:19:34.987Z",
      });
    });

    // TODO recuperer la liste des joueurs
    setListeJoueurs([
      "mathis",
      "lucacao",
      "marcel",
      "marcelle",
      "camilleCosmique",
      "joueur1",
      "joueur2",
      "joue",
      "joueur4",
      "joueur5",
    ]);

    // TODO recup le pouvoir et role (si role === mort, recuperer ancien role ?) !
    setRole("Loup-garou");
    setPouvoir("Contamination");
  }, []);

  useEffect(() => {
    if (game) {
      setGameDetails([
        { label: `Numéro partie : ${game.idGame}` },
        { label: `Nombre de joueurs : ${game.nbJoueur}` },
        { label: `Duree du jour : ${secondsToText(game.dureeJour)}` },
        { label: `Duree de la nuit : ${secondsToText(game.dureeNuit)}` },
        { label: `Date de debut : ${dateToText(game.dateDeb)}` },
        { label: `Probabilité de pouvoir : ${game.probaPouv}` },
        { label: `Probabilité de loup-garou : ${game.probaLoup}` },
      ]);
    }
  }, [game]);

  if (!game) {
    return null; // or a loading indicator if desired
  }

  return (
    <View style={styles.container}>
      <View>
        <SizedText
          label={`Infos de la partie`}
          size={"large"}
          textStyle={styles.title}
        />

        {gameDetails.map((detail, index) => (
          <SizedText
            key={index}
            label={detail.label}
            size={"normal"}
            textStyle={styles.gameDetail}
          />
        ))}
      </View>

      <View style={styles.separator}></View>

      <View>
        <SizedText
          label={`Liste des joueurs`}
          size={"large"}
          textStyle={styles.title}
        />
        <Text style={[styles.infosJoueurs, styles.gameDetail]}>
          {listeJoueurs.map((joueur, index) => (
            <SizedText
              key={joueur}
              label={joueur + (index !== listeJoueurs.length - 1 ? " - " : "")}
              size={"normal"}
            />
          ))}
        </Text>
      </View>

      <View style={styles.separator}></View>

      <View>
        <SizedText
          label={`Vos informations`}
          size={"large"}
          textStyle={styles.title}
        />
        <SizedText
          label={
            `Vous êtes : ${role}` +
            (role === "mort" ? " (anciennement LG)" : "")
          } // TODO changer anciennement
          size={"normal"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Vous avez le pouvoir : ${pouvoir}`}
          size={"normal"}
          textStyle={styles.gameDetail}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffffaa",
    padding: 10,
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  separator: {
    borderTopWidth: 1,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  gameDetail: {
    marginBottom: 3,
    marginLeft: 20,
  },
});

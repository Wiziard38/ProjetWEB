import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SizedText from "../SizedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secondsToText, dateToText } from "../../utils/dateFunctions";

export default function Votes() {
  const [game, setGame] = useState(null);
  const [role, setRole] = useState(null);
  const [pouvoir, setPouvoir] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup les infos de la partie de idGame {idGame}
      setGame({
        createdAt: "2023-04-27T08:19:34.987Z",
        dateDeb: "2023-01-17T04:33:12.000Z",
        dureeJour: 3600,
        dureeNuit: 3600,
        idGame: "XXX",
        nbJoueur: 7,
        probaLoup: 0,
        probaPouv: 0,
        updatedAt: "2023-04-27T08:19:34.987Z",
      });
    });
  }, []);

  if (!game) {
    return null; // or a loading indicator if desired
  }

  return (
    <View style={styles.container}>
      <View style={styles.infosGame}>
        <SizedText
          label={`Partie numéro ${game.idGame}`}
          size={"xlarge"}
          textStyle={styles.gameTitle}
        />
        <SizedText
          label={`Nombre de joueurs : ${game.nbJoueur}`}
          size={"normal"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Duree du jour : ${secondsToText(game.dureeJour)}`}
          size={"normal"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Duree de la nuit : ${secondsToText(game.dureeNuit)}`}
          size={"normal"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Date de debut : ${dateToText(game.dateDeb)}`}
          size={"normal"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Probabilité de pouvoir : ${game.probaPouv}`}
          size={"normal"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Probabilité de loup-garou : ${game.probaLoup}`}
          size={"normal"}
          textStyle={styles.gameDetail}
        />
      </View>
      <View style={styles.infosPlayer}>
        <SizedText
          label={
            `Vous êtes : ${role}` + (role === "mort" ? " (anciennement LG)" : "")
          } // TODO changer anciennement
          size={"large"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Vous avez le pouvoir : ${pouvoir}`}
          size={"large"}
          textStyle={styles.gameDetail}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  infosGame: {
    borderBottomWidth: 1,
    paddingBottom: 30,
  },
  infosPlayer: {
    paddingTop: 20,
  },
  gameTitle: {
    fontWeight: "bold",
  },
  gameDetail: {
    marginTop: 15,
    marginLeft: 20,
  },
});

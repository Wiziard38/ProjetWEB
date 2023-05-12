import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import SizedText from "../SizedText";
import { secondsToHHMM, dateToText } from "../../utils/dateFunctions";
import GameContext from "./GameContext";

export default function InfosGame() {
  const [gameDetails, setGameDetails] = useState([]);
  const gameInfos = useContext(GameContext);

  useEffect(() => {
    if (gameInfos.infos) {
      setGameDetails([
        { label: `Numéro partie : ${gameInfos.infos.idGame}` },
        { label: `Nombre de joueurs : ${gameInfos.infos.nbJoueur}` },
        { label: `Duree du jour : ${secondsToHHMM(gameInfos.infos.dureeJour)}` },
        { label: `Duree de la nuit : ${secondsToHHMM(gameInfos.infos.dureeNuit)}` },
        { label: `Date de debut : ${dateToText(gameInfos.infos.dateDeb)}` },
        { label: `Probabilité de pouvoir : ${gameInfos.infos.probaPouv}` },
        { label: `Probabilité de loup-garou : ${gameInfos.infos.probaLoup}` },
      ]);
    }
  }, [gameInfos.infos]);

  if (!gameInfos.infos) {
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
          {gameInfos.listeJoueurs.map((joueur, index) => (
            <SizedText
              key={joueur}
              label={joueur + (index !== gameInfos.listeJoueurs.length - 1 ? " - " : "")}
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
            `Vous êtes : ${gameInfos.role}` +
            (gameInfos.role === "mort" ? " (anciennement ???)" : "")
          } // TODO changer anciennement
          size={"normal"}
          textStyle={styles.gameDetail}
        />
        <SizedText
          label={`Vous avez le pouvoir : ${gameInfos.power}`}
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

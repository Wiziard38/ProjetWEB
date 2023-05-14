import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, FlatList, Pressable, Image } from "react-native";
import SizedText from "../SizedText";
import { secondsToHHMM, dateToText } from "../../utils/dateFunctions";
import GameContext from "./GameContext";

export default function InfosGame() {
  const [viewItems, setViewItems] = useState([]);
  const [data, setData] = useState([]);
  const gameInfos = useContext(GameContext);

  useEffect(() => {
    if (gameInfos) {
      setData([
        {
          title: "Informations de la partie",
          body: [
            `Numéro partie : ${gameInfos.infos.idGame}`,
            `Nombre de joueurs : ${gameInfos.infos.nbJoueur}`,
            `Duree du jour : ${secondsToHHMM(gameInfos.infos.dureeJour)}`,
            `Duree de la nuit : ${secondsToHHMM(gameInfos.infos.dureeNuit)}`,
            `Date de debut : ${dateToText(gameInfos.infos.dateDeb)}`,
            `Probabilité de pouvoir : ${gameInfos.infos.probaPouv}`,
            `Probabilité de loup-garou : ${gameInfos.infos.probaLoup}`,
          ],
        },
        {
          title: "Vos informations",
          body: [
            `Vous êtes : ${gameInfos.role}${
              gameInfos.role === "mort" ? " (anciennement ???)" : ""
            }`,
            `Vous avez le pouvoir : ${gameInfos.power}`,
          ],
        },
        {
          title: "Etat courant de la partie",
          body: [
            "Phase de jeu : Jour 1 (TODO)",
            "Temps restant avant changement de phase : 1s (TODO)",
          ],
        },

        {
          title: "Liste des joueurs",
          body: [
            gameInfos.listeJoueurs
              .map(
                (player) =>
                  `${player} : ${
                    gameInfos.listeJoueursVivants.includes(player)
                      ? "vivant"
                      : "mort"
                  }`
              )
              .join("\n"),
          ],
        },
      ]);
    }
  }, [gameInfos.infos]);

  const handlePress = (index) => {
    if (viewItems.includes(index)) {
      setViewItems(viewItems.filter((item) => item !== index));
    } else {
      setViewItems([...viewItems, index]);
    }
  };

  function renderItem({ item, index }) {
    const rotation = viewItems.includes(index) ? "90deg" : "0deg";

    return (
      <View>
        <Pressable onPress={() => handlePress(index)} style={styles.item}>
          <View style={styles.titleContainer}>
            <SizedText
              label={item.title}
              size={"large"}
              textStyle={styles.itemTitle}
            />

            <Image
              style={[
                styles.chevronImage,
                { transform: [{ rotate: rotation }] },
              ]}
              source={require("../../assets/images/chevron.png")}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </View>
        </Pressable>

        {viewItems.includes(index) && (
          <View style={styles.itemDetails}>
            {item.body.map((detail, index) => (
              <SizedText
                key={index}
                label={detail}
                size={"normal"}
                textStyle={styles.gameDetail}
              />
            ))}
          </View>
        )}
        {index !== data.length - 1 && <View style={styles.separator}></View>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SizedText
        label="Informations générales"
        size="xlarge"
        textStyle={styles.title}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        style={styles.itemList}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffffaa",
    paddingHorizontal: 10,
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  separator: {
    borderTopWidth: 1,
    marginVertical: 10,
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    paddingVertical: 5,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 15,
  },
  gameDetail: {
    marginBottom: 3,
    marginLeft: 20,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    paddingRight: 5,
  },
  chevronImage: {
    width: 20,
    height: 20,
  },
});

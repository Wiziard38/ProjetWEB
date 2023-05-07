import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SizedText from "../SizedText";
import SizedButton from "../SizedButton";
import DisplayMessage from "../DisplayMessage";
import DropDownPicker from "react-native-dropdown-picker";

export default function Powers() {
  const [power, setPower] = useState(null);
  const [powerUsed, setPowerUsed] = useState(false);
  const [voyanceInfos, setVoyanceInfos] = useState(null);

  const [listPlayers, setListPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [open, setOpen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  const powerDescription = [
    {
      title: "Contamination",
      description:
        "Vous permet de transformer chaque nuit un humain en loup-garou.",
    },
    {
      title: "Voyance",
      description:
        "Vous permet de connaître le rôle et les pouvoirs d'un joueur de votre choix chaque nuit.",
    },
    {
      title: "Spiritisme",
      description:
        "Vous permet de parler avec un joueur éliminé de votre choix chaque nuit.",
    },
    {
      title: "Insomnie",
      description:
        "Vous permet d'assister aux discussions du repaire des loups-garous (mais vous ne pouvez pas envoyer de message).",
    },
  ];

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup le pouvoir
      setPower("Spiritisme");

      // TODO recup la liste des joueurs associés au pouvoir
      const list = [
        "mathis",
        "lucacao",
        "marcel",
        "marcelle",
        "camilleCos",
        "camilleCosm",
        "camilleCosmi",
        "camilleCosmiq",
        "camilleCosmiqu",
        "camilleCosmique",
        "joueur1",
        "joue",
        "joueur4",
      ];

      setListPlayers(list.map((player) => ({ label: player, value: player })));

      //TODO recup si pouvoir deja utilisé
      setPowerUsed(false);
      // Si deja used et le pouvoir est voyance, recup les infos du joeuur qui a été observé
      setVoyanceInfos({
        joueur: "Jules",
        role: "loup-garou",
        pouvoir: "Contamination",
      });
    });
  }, []);

  function activatePower() {
    if (selectedPlayer) {
      // TODO recup infos et activer pouvoir
      const baseText = `Vous avez activé l'effet de votre pouvoir sur "${selectedPlayer}".\n\n`;
      switch (power) {
        case "Contamination":
          setModalText(
            baseText + `Ce joueur va etre transformé en loup-garou.`
          );
          break;

        case "Voyance":
          //TODO recup les infos du joueur selectedPlayer
          const infos = { role: "loup-garou", pouvoir: "Contamination" };
          setModalText(
            baseText +
              `Ce joueur est ${infos.role}, et ${
                infos.pouvoir === null
                  ? "il n'a pas de pouvoir"
                  : "il possède le pouvoir " + infos.pouvoir
              }.`
          );
          break;

        case "Spiritisme":
          setModalText(
            baseText +
              `Vous pouvez maintenant parler au joueur mort "${selectedPlayer}".`
          );
          break;

        case "default":
          console.log("Problem, contact developpers.");
      }
      setModalVisible(true);
      setSelectedPlayer(null);
      setPowerUsed(true);
    }
  }

  return (
    <View style={styles.container}>
      <DisplayMessage
        visible={modalVisible}
        textMessage={modalText}
        onPress={() => setModalVisible(false)}
      />

      <SizedText
        label={`Utilisation de votre pouvoir`}
        size={"xlarge"}
        textStyle={styles.title}
      />
      <SizedText
        label={`${power}`}
        size={"large"}
        textStyle={styles.subtitle}
      />
      <SizedText
        label={`${
          powerDescription.find((powerItem) => powerItem.title === power)
            ?.description || ""
        }`}
        size={"small"}
        textStyle={styles.description}
      />

      <View style={styles.separator} />

      {powerUsed || power === "Insomnie" ? (
        <>
          <SizedText
            label={
              power === "Insomnie"
                ? "Il n'y a rien a faire pour votre pouvoir !"
                : "Vous avez déjà utilisé votre pouvoir !"
            }
            size="normal"
            textStyle={styles.description}
          />
          {power === "Voyance" && (
            <SizedText
              label={`Le joueur ${voyanceInfos.joueur} a pour rôle ${voyanceInfos.role} et pour pouvoir ${voyanceInfos.pouvoir}.`}
              size="normal"
              textStyle={styles.description}
            />
          )}
        </>
      ) : (
        <View style={styles.select}>
          {listPlayers.length > 0 ? (
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              value={selectedPlayer}
              setValue={setSelectedPlayer}
              items={listPlayers}
              setItems={setListPlayers}
              style={styles.dropDownPicker}
              textStyle={!open && { fontWeight: "bold", color: "white" }}
              dropDownContainerStyle={{ width: "90%", alignSelf: "center" }}
              placeholder="Choisir un joueur"
            />
          ) : (
            <SizedText
              label="Aucun joueur possible"
              size="normal"
              textStyle={styles.emptyList}
            />
          )}

          <SizedButton
            buttonLabel={`Utiliser mon pouvoir sur ${
              selectedPlayer !== null ? selectedPlayer : "[choisir]"
            }`}
            onPress={activatePower}
            size="normal"
            buttonStyle={[
              styles.submitButton,
              selectedPlayer === null && { backgroundColor: "gray" },
            ]}
            buttonLabelStyle={[
              styles.submitButtonLabel,
              selectedPlayer === null && { color: "#000000" },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "space-between",
    backgroundColor: "#ffffffaa",
    padding: 10,
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  createVote: {
    flex: 1,
    width: "100%",
  },
  ratifyVote: {
    flex: 1,
    width: "100%",
  },
  select: {
    alignItems: "center",
  },
  separator: {
    borderTopWidth: 1,
    marginVertical: 15,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 3,
  },
  description: {
    fontStyle: "italic",
    marginBottom: 15,
  },
  dropDownPicker: {
    alignSelf: "center",
    width: "80%",
    backgroundColor: "#8000008d",
  },
  submitButton: {
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#8000008d",
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  submitButtonLabel: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  emptyList: {
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#8000008d",
    borderColor: "black",
    borderRadius: 12,
    overflow: "hidden",
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: "black",
  },
});

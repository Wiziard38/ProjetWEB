import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SizedText from "../SizedText";
import SizedButton from "../SizedButton";
import DisplayMessage from "../DisplayMessage";
import DropDownPicker from "./DropDownPicker";

export default function Votes() {
  const [listPlayers1, setListPlayers1] = useState([]);
  const [listPlayers2, setListPlayers2] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup nb joueurs
      const nbJoueurs = 17;
      // TODO recup la liste des joueurs pas encore un vote
      const list1 = [
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
      // TODO recup la liste des joueurs deja un vote et nb votes
      const list2 = [
        { name: "jullleeessss", votes: 5 },
        { name: "jullleeessss22", votes: 4 },
        { name: "jules3", votes: 1 },
        { name: "jules5", votes: 3 },
        { name: "jules4", votes: 2 },
        { name: "camcam", votes: 1 },
      ];

      setListPlayers1(
        list1.map((player) => ({ label: player, value: player }))
      );
      setListPlayers2(
        list2.map((player, index) => ({
          label: `[${player.votes}/${nbJoueurs}] - ${player.name}`,
          value: player.name,
          key: index.toString(),
          votes: player.votes,
        }))
      );
    });
  }, []);

  function createVote() {
    setOpen1(false);
    setOpen2(false);
    if (selectedPlayer1 !== null) {
      // TODO A FAIRE
      console.log("Creer vote contre " + selectedPlayer1);
      setSelectedPlayer1(null);
      setModalText(`Vous avez créé un nouveau vote contre ${selectedPlayer1}`);
      setModalVisible(true);
    }
  }

  function ratifyVote() {
    setOpen1(false);
    setOpen2(false);
    if (selectedPlayer2 !== null) {
      const selectedPlayer = listPlayers2.find(
        (player) => player.value === selectedPlayer2
      );
      // TODO A FAIRE
      console.log("Creer vote contre " + selectedPlayer2);
      setSelectedPlayer2(null);
      setModalText(
        `Vous avez ratifié le vote contre ${selectedPlayer.value}.\n\n Il y a ${
          selectedPlayer.votes + 1
        } votes contre ${selectedPlayer.value} actuellement.`
      );
      setModalVisible(true);
    }
  }

  return (
    <View style={styles.container}>
      <DisplayMessage
        visible={modalVisible}
        textMessage={modalText}
        onPress={() => setModalVisible(false)}
      />

      <View>
        <SizedText
          label={`Créer un nouveau vote`}
          size={"xlarge"}
          textStyle={styles.title}
        />

        <SizedText
          label={"Vous souhaitez créer un nouveau vote contre un joueur ?"}
          size={"small"}
          textStyle={styles.description}
        />
      </View>

      <DropDownPicker
        open={open1}
        setOpen={setOpen1}
        players={listPlayers1}
        selectedPlayer={selectedPlayer1}
        setSelectedPlayer={setSelectedPlayer1}
        emptyListLabel={"Aucun joueur possible"}
        onOpenTrigger={() => setOpen2(false)}
      />

      <SizedButton
        buttonLabel={`Vote contre ${
          selectedPlayer1 !== null
            ? selectedPlayer1.length > 12
              ? selectedPlayer1.slice(0, 9) + "..."
              : selectedPlayer1
            : "[choisir]"
        }`}
        onPress={createVote}
        size="normal"
        buttonStyle={[
          styles.submitButton,
          selectedPlayer1 === null && { backgroundColor: "gray" },
        ]}
        buttonLabelStyle={[
          styles.submitButtonLabel,
          selectedPlayer1 === null && { color: "#000000" },
        ]}
      />

      <View style={styles.separator} />

      <View>
        <SizedText
          label={`Ratifier un vote existant`}
          size={"xlarge"}
          textStyle={styles.title}
        />

        <SizedText
          label={"Vous souhaitez ratifier un vote déjà existant ?"}
          size={"small"}
          textStyle={styles.description}
        />
      </View>

      <DropDownPicker
        open={open2}
        setOpen={setOpen2}
        players={listPlayers2}
        selectedPlayer={selectedPlayer2}
        setSelectedPlayer={setSelectedPlayer2}
        emptyListLabel={"Aucun joueur possible"}
        openDirection="TOP"
        onOpenTrigger={() => setOpen1(false)}
      />

      <SizedButton
        buttonLabel={`Vote contre ${
          selectedPlayer2 !== null
            ? selectedPlayer2.length > 12
              ? selectedPlayer2.slice(0, 9) + "..."
              : selectedPlayer2
            : "[choisir]"
        }`}
        onPress={ratifyVote}
        size="normal"
        buttonStyle={[
          styles.submitButton,
          selectedPlayer2 === null && { backgroundColor: "gray" },
        ]}
        buttonLabelStyle={[
          styles.submitButtonLabel,
          selectedPlayer2 === null && { color: "#000000" },
        ]}
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
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
    padding: 10,
    zIndex: 1,
  },
  select: {
    flex: 1,
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  separator: {
    borderTopWidth: 1,
    marginVertical: 15,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  description: {
    fontStyle: "italic",
    marginBottom: 5,
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
    marginVertical: 5,
  },
  submitButtonLabel: {
    fontWeight: "bold",
    color: "white",
  },
});

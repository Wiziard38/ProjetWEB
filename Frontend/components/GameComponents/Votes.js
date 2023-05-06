import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SizedText from "../SizedText";
import SizedButton from "../SizedButton";
import PlayerScrollList from "./PlayerScrollList";
import DropDownPicker from "react-native-dropdown-picker";
import { secondsToText, dateToText } from "../../utils/dateFunctions";

export default function Votes() {
  const [listPlayers, setListPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup la liste des joueurs
      const list = [
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
      ];
      setListPlayers(list.map((player) => ({ label: player, value: player })));
    });
  }, []);

  function createVote() {
    if (selectedPlayer !== null) {
      // TODO A FAIRE
      console.log("Creer vote contre " + selectedPlayer);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.createVote}>
        <SizedText
          label={`Créer un nouveau vote`}
          size={"xlarge"}
          textStyle={styles.title}
        />

        <DropDownPicker
          open={open}
          value={selectedPlayer}
          items={listPlayers}
          setOpen={setOpen}
          setValue={setSelectedPlayer}
          setItems={setListPlayers}
        />

        <SizedButton
          buttonLabel={`Vote contre ${selectedPlayer}`}
          onPress={createVote}
          size="large"
          buttonStyle={[
            styles.submitButton,
            selectedPlayer === null && { backgroundColor: "gray" },
          ]}
          buttonLabelStyle={styles.submitButtonLabel}
        />
      </View>

      <View style={styles.separator} />

      <View style={styles.itemContainer}>
        <SizedText
          label={`Ratifier un vote existant`}
          size={"xlarge"}
          textStyle={styles.title}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "space-around",
  },
  createVote: {
    flex: 1,
    width: "100%",
    zIndex: 9999,
  },

  itemContainer: {
    flex: 1,
    width: "100%",
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
  submitButton: {
    alignSelf: "center",
    width: "80%",
    backgroundColor: "#8000008d",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  submitButtonLabel: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

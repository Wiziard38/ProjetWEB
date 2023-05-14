import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SizedText from "../SizedText";
import SizedButton from "../SizedButton";
import DisplayMessage from "../DisplayMessage";
import DropDownPicker from "react-native-dropdown-picker";
import { fetchData } from "../../utils/fetchData";
const config = require("../../config.js");
const { BACKEND } = config;

export default function Votes({token, socket}) {
  const [listPlayers1, setListPlayers1] = useState([]);
  const [listPlayers2, setListPlayers2] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [username, setUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  
  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup nb joueurs
      const nbJoueurs = 17;
      // TODO recup la liste des joueurs pas encore un vote
      fetchData(`game/playerVote/${idGame}`, 'GET')
        .then(json => {
          let list1 = json.playersAvailable;
          list1 = list1.map((player) => ({ label: player, value: player }));
          setListPlayers1(list1);
          console.log("Création list1:",listPlayers1)
        })
        .catch(error=>console.log(error));
      fetchData(`game/listRatification/${idGame}`, 'GET')
      .then(json=> {
        let list2 = json.playersRat;
        list2 = list2.map((player, index) => ({
          label: `[${player.votes}/${nbJoueurs}] - ${player.name}`,
          value: player.name,
          key: index.toString(),
          votes: player.votes,
        }));
        setListPlayers2(list2);
        console.log("Création list2:",list2)
      })
      .catch(error=>console.log(error));
    });

    socket.current.on("recepVote", (usernameVote) => {
      console.log("recep vote", usernameVote);
      console.log("Création list2:",listPlayers1);
      console.log("Création list1:",listPlayers2)
      const index = listPlayers1.indexOf({label: usernameVote, value: usernameVote});
      console.log(index)
      if (index != -1) {
        setListPlayers1(listPlayers1.splice(index, 1));
      }
      setListPlayers2(listPlayers2.push(usernameVote));
    });
    fetchData("whoami", "GET")
    .then(json=>setUsername(json.username));
      // TODO recup la liste des joueurs deja un vote et nb votes
  }, []);

  function createVote() {
    setOpen1(false);
    setOpen2(false);
    if (selectedPlayer1 !== null) {
      // TODO A FAIRE 
      if (socket.current) {
        socket.current.emit("propVote", username,selectedPlayer1)
      }
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

      <View style={[styles.createVote, open1 && { zIndex: 9999 }]}>
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

        <View style={styles.select}>
          {listPlayers1.length > 0 ? (
            <DropDownPicker
              open={open1}
              setOpen={setOpen1}
              value={selectedPlayer1}
              setValue={setSelectedPlayer1}
              items={listPlayers1}
              setItems={setListPlayers1}
              style={styles.dropDownPicker}
              textStyle={!open1 && styles.submitButtonLabel}
              dropDownContainerStyle={{ width: "90%", alignSelf: "center" }}
              placeholder="Choisir un joueur"
              onOpen={() => setOpen2(false)}
            />
          ) : (
            <SizedText
              label="Aucun joueur possible"
              size="normal"
              textStyle={styles.emptyList}
            />
          )}

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
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.ratifyVote}>
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

        <View style={styles.select}>
          {listPlayers2.length > 0 ? (
            <DropDownPicker
              open={open2}
              setOpen={setOpen2}
              value={selectedPlayer2}
              setValue={setSelectedPlayer2}
              items={listPlayers2}
              setItems={setListPlayers2}
              style={styles.dropDownPicker}
              textStyle={!open2 && styles.submitButtonLabel}
              dropDownContainerStyle={{ width: "90%", alignSelf: "center" }}
              placeholder="Choisir un joueur"
              onOpen={() => setOpen1(false)}
            />
          ) : (
            <SizedText
              label="Aucun joueur possible"
              size="normal"
              textStyle={styles.emptyList}
            />
          )}

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
    width: "100%",
    padding: 10,
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
    flex: 1,
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
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

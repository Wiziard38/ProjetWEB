import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SizedText from "../SizedText";
import SizedButton from "../SizedButton";
import DisplayMessage from "../DisplayMessage";
import { fetchData } from "../../utils/fetchData";
const config = require("../../config.js");
const { BACKEND } = config;
import DropDownPicker from "./DropDownPicker";

export default function Votes({socket}) {
  const [listPlayers1, setListPlayers1] = useState([]);
  const [listPlayers2, setListPlayers2] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [username, setUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [nbJoueur, setNbJoueur] = useState(17);
  
  useEffect(() => {
    if (socket.current) {
      socket.current.on("recepVote", (usernameVotant, usernameVote) => {
        console.log("recep vote", usernameVote);
        const newRat = {label: `[1/${nbJoueur}] - ${usernameVote}` , value: usernameVote};
        if (usernameVotant !== username){
          setListPlayers2((prev) => ([...prev, newRat]));
        }
        setListPlayers1(prevList => prevList.filter(item => item.value !== usernameVote));
      });

      socket.current.on("recepRat", (usernameVote, nbVotant) => {
        setListPlayers2(prevList => [...prevList.filter(item => item.value !== usernameVote), {label: `[${nbVotant}/${nbJoueur}] - ${usernameVote}`, value: usernameVote}]);
        setModalText(
          `Vous avez ratifié le vote contre ${usernameVote}.\n\n Il y a ${
            nbVotant
          } votes contre ${usernameVote} actuellement.`
        );
        setModalVisible(true);  
      })
    };
    fetchData("whoami", "GET")
    .then(json=>setUsername(json.username));
      // TODO recup la liste des joueurs deja un vote et nb votes
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup nb joueurs
      const nbJoueurs = 17;
      // TODO recup la liste des joueurs pas encore un vote
      fetchData(`game/playerVote/${idGame}`, 'GET')
        .then(json => {
          const list1 = json.playersAvailable;
          const list2 = list1.map((player) => ({ label: player, value: player }));
          setListPlayers1(list2);
        })
        .catch(error=>console.log(error));
      fetchData(`game/listRatification/${idGame}`, 'GET')
      .then(json=> {
        const list1 = json.playersRat;
        const list2 = list1.map((player) => ({
          label: `[${player.votes}/${nbJoueurs}] - ${player.name}`,
          value: player.name,
        }));
        setListPlayers2(list2);
      })
      .catch(error=>console.log(error));
    });
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
      if (socket.current) {
        socket.current.emit("ratification", username,selectedPlayer2)
      }
      console.log("Creer vote contre " + selectedPlayer2);
      setSelectedPlayer2(null);
      
      
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

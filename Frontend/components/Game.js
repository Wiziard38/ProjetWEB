import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocketIOClient, { connect } from "socket.io-client";
import MessagesScreen from "./GameComponents/MessagesScreen";
import GameMenuDepth0 from "./GameComponents/GameMenuDepth0";
import GameHeader from "./GameComponents/GameHeader";
import GameContext from "./GameComponents/GameContext";

const config = require("../config.js");
const { BACKEND } = config;

export default function Game({ token }) {
  // TODO
  const [menuDepth, setMenuDepth] = useState(0);
  const [role, setRole] = useState(null);
  const [team, setTeam] = useState(null);
  const [testName, setTestName] = useState(null);
  const [switchTime, setSwitchTime] = useState(
    new Date().setHours(new Date().getHours() + 1)
  ); // TODO recup time
  const [powerUsed, setPowerUsed] = useState(false);
  const [isDay, setIsDay] = useState(true);
  const [isDead, setIsDead] = useState(true);
  const [power, setPower] = useState(null);
  const [isElectedSpiritism, setIsElectedSpiritism] = useState(null);
  const [listeJoueurs, setListeJoueurs] = useState([]);
  const [gameInfos, setGameInfos] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO RECUP TOUTES LES INFOS DE LA PARTIE
      setIsDay(true);
      setIsDead(false);
      setPowerUsed(false);
      setPower("voyance");
      setIsElectedSpiritism(false);
      setRole("LG");
      setGameInfos({
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
    });
  }, []);

  const socket = useRef(null);
  // console.log(socket);

  useEffect(() => {
    if (socket.current === null) {
      socket.current = SocketIOClient(BACKEND + "/1", {
        auth: {
          token: token,
        },
      })
      // console.log(socket.current);
      socket.current.on("connect", () => {
        console.log("Connected to server");
        // socket.emit('proposal', 'bin voui c ez');
      });
      socket.current.on("disconnect", () => {
        console.log("disconnect");
        socket.current.disconnect();
      });
      socket.current.on("game_data", (msg) => {
        // console.log(msg);
      });
      // TODO DELETE_ALL_TEST_MSG
      socket.current.on("info_TEST", (userName, role, team) => {
        setRole(role);
        setTeam(team);
        setTestName(userName);
        console.log(
          "userName : " + userName + ", role : " + role + ", team : " + team
        );
      });

      // socket.current.on("receive_msg", (msg) => {
      //   console.log(msg);
      // });

      socket.current.on("day", (msg) => {
        console.log(msg);
        setIsDay(true);
      });

      socket.current.on("night", (msg) => {
        console.log(msg);
        setIsDay(false);
      });

      socket.current.on("begin", (msg) => {
        console.log(msg);
      });
    }
  }, []);

  function emission() {
    socket.current.emit(
      "message",
      "Je suis : " + testName + ", mon role : " + role + ", ma team : " + team
    );
  }

  return (
    <View style={styles.container}>
      <GameContext.Provider
        value={{
          isDay,
          isDead,
          power,
          isElectedSpiritism,
          role,
          powerUsed,
          gameInfos,
          listeJoueurs,
        }}
      >
        <GameHeader switchTime={switchTime} isDay={isDay} />

        <ImageBackground
          source={
            isDay
              ? require("../assets/images/bg_day.jpg")
              : require("../assets/images/bg_night.jpg")
          }
          style={styles.imageBackground}
        >
          <MessagesScreen setMenuDepth={setMenuDepth} socket={socket}/>

          <GameMenuDepth0 menuDepth={menuDepth} setMenuDepth={setMenuDepth} />
        </ImageBackground>
      </GameContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
});

Game.propTypes = {
  token: PropTypes.string.isRequired,
};

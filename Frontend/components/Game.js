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
  const [menuDepth, setMenuDepth] = useState(0);
  const [gameInfos, setGameInfos] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      if (socket.current === null) {
        socket.current = SocketIOClient(`${BACKEND}/${idGame}`, {
          auth: {
            token: token,
          },
        });

        socket.current.on("connect", () => {
          socket.current.emit("ask_game_data");
          // socket.emit('proposal', 'bin voui c ez');
        });

        socket.current.on("disconnect", () => {
          console.log("disconnect");
          socket.current.disconnect();
        });

        socket.current.on("game_data", (msg) => {
          // console.log(msg)
          console.log("game_data reçu");
          setGameInfos(JSON.parse(msg));
        });

        socket.current.on("day", (msg, dayDuration) => {
          console.log(`${msg}, duration jour : ${dayDuration}ms`);
          setGameInfos((prevGameInfos) => ({
            ...prevGameInfos, // Copy the previous gameInfos object
            isDay: true,
            switchTime: dayDuration,
          }));
        });

        socket.current.on("night", (msg, nightDuration) => {
          console.log(`${msg}, duration nuit : ${nightDuration}ms`);
          setGameInfos((prevGameInfos) => ({
            ...prevGameInfos, // Copy the previous gameInfos object
            isDay: false,
            switchTime: nightDuration,
          }));
        });

        socket.current.on("begin", (msg) => {
          console.log(msg);
        });
      }
    });
    return () => {
      socket.current.off("begin");
      socket.current.off("night");
      socket.current.off("day");
      socket.current.off("game_data");
      socket.current.off("disconnect");
      socket.current.off("connect");
    };
  }, []);

  if (gameInfos == null) {
    return;
  }

  return (
    <View style={styles.container}>
      <GameContext.Provider value={gameInfos}>
        <GameHeader />

        <ImageBackground
          source={
            gameInfos.isDay
              ? require("../assets/images/bg_day.jpg")
              : require("../assets/images/bg_night.jpg")
          }
          style={styles.imageBackground}
        >
          <MessagesScreen setMenuDepth={setMenuDepth} socket={socket} />

          <GameMenuDepth0
            menuDepth={menuDepth}
            setMenuDepth={setMenuDepth}
            socket={socket}
          />
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

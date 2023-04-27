import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import SocketIOClient, { connect } from "socket.io-client";
import MessagesScreen from "./GameComponents/MessagesScreen";
import GameMenuDepth0 from "./GameComponents/GameMenuDepth0";

export default function Game({ gameId, token }) {
  // TODO
  const [role, setRole] = useState(null);
  const [team, setTeam] = useState(null);
  const [testName, setTestName] = useState(null);

  const socket = useRef(
    SocketIOClient("http://localhost:3000/0", {
      auth: {
        token,
      },
    })
  );
  console.log(socket);

  useEffect(() => {
    console.log("TEST");
    if (socket.current) {
      socket.current.on("connect", () => {
        console.log("Connected to server");
        // socket.emit('proposal', 'bin voui c ez');
      });
      socket.current.on("disconnect", () => {
        console.log("disconnect");
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

      socket.current.on("receive_msg", (msg) => {
        console.log(msg);
      });

      socket.current.on("day", (msg) => {
        console.log(msg);
      });

      socket.current.on("night", (msg) => {
        console.log(msg);
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
      <MessagesScreen />

      <GameMenuDepth0 />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Game.propTypes = {
  gameId: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import SocketIOClient, { connect } from "socket.io-client";
import MessagesScreen from "./GameComponents/MessagesScreen";
import MenuShow from "./GameComponents/MenuShow";

export default function CreateNewGame({ gameId, token }) {
  // TODO
  const [role, setRole] = useState(null);
  const [team, setTeam] = useState(null);
  const [testName, setTestName] = useState(null);
  const [menuShow, setMenuShow] = useState(false);

  let socket = useRef(null);

  useEffect(() => {
    if (socket.current === null) {

      socket.current = SocketIOClient("http://localhost:3000/1", {
        auth: {
          token: token,
        },
      })
      socket.current.on("connect", () => {
        console.log("Connected to server");
        null;
        // socket.emit('proposal', 'bin voui c ez');
      });
      socket.current.on("disconnect", () => {
        console.log("disconnect");
      });
      socket.current.on("game_data", (msg) => {
        // console.log(msg);
      });
      //TODO DELETE_ALL_TEST_MSG
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

  function onMenuShow() {
    setMenuShow(true);
  }
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  return (
    <View style={styles.container}>
      <MessagesScreen />
      <Pressable style={[!menuShow ? styles.menuButtonShown : styles.menuButtonHidden, styles.menuButton]} onPress={() => onMenuShow()}>
        {!menuShow ? (
          <Image
            style={styles.menuImage}
            source={require("../assets/images/menu.png")}
            resizeMethod="scale"
            resizeMode="contain"
          />
        ) : (
          <MenuShow setMenuShow={setMenuShow} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  messageContainer: {
    flex: 1,
    width: "100%",
  },
  buttonLabel: {
    color: "white",
    backgroundColor: "black",
  },
  menuButton: {
    position: "absolute",
    top: 30,
    right: 10,
    zIndex: 100,
  },
  menuButtonShown: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 40,
    padding: 20,
  },
  menuButtonHidden: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  menuImage: {
    width: 40,
    height: 40,
  },
});

CreateNewGame.propTypes = {
  gameId: PropTypes.number.isRequired,
};

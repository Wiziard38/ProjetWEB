
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect, React } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginForm from "./components/LoginForm";
import MenuSelection from "./components/MenuSelection";
import ConnectedHeader from "./components/ConnectedHeader";
import CreateNewGame from "./components/CreateNewGame";
import ListNewGames from "./components/ListNewGames";
import ListMyGames from "./components/ListMyGames";
import SocketIOClient from 'socket.io-client';
const config = require("./config.js");
const { BACKEND } = config;

export default function App() {
  const socket = useRef(SocketIOClient('http://localhost:3000')).current;
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('eazy', 'bin voui c ez');
    })
  });

  
  const [token, setToken] = useState(null);
  const [loggingState, setLoggingState] = useState(true);
  const [menuState, setMenuState] = useState(0);
  const [errorTextValue, setErrorTextValue] = useState("");
  const [connectedUsername, setConnectedUsername] = useState("");

  function connect(username, password) {
    const loginURL = loggingState ? `${BACKEND}/login` : `${BACKEND}/signin`;
    fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": BACKEND,
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.status) {
          setErrorTextValue(json.message);
        } else if (json.data.token) {
          setErrorTextValue("");
          setConnectedUsername(json.data.username);
          setToken(json.data.token);
          AsyncStorage.setItem("token", json.data.token)
            .then(() => console.log("Token stored successfully"))
            .catch((error) => console.log(error));
          if (!loggingState) {
            window.alert(`Bienvenue ${connectedUsername}, vous avez été inscrit.`);
          }
        } else {
          setErrorTextValue("Server error, should not happen");
        }
      })
      .catch((error) => {
        setErrorTextValue("Erreur serveur");
        console.log(error);
      });
  }

  async function disconnect() {
    try {
      await AsyncStorage.removeItem("token");
      console.log("Removed token from storage succesfully");
    } catch (e) {
      console.log("Could not remove token from storage");
    }
    setMenuState(0);
    setToken(null);
  }

  return (
    <View style={styles.container}>
      {!token ? (
        // If no token (user non connected)
        <LoginForm
          onConnect={connect}
          errorTextValue={errorTextValue}
          setErrorTextValue={setErrorTextValue}
          loggingState={loggingState}
          setLoggingState={setLoggingState}
        />
      ) : (
        // If token (user connected)
        <View style={styles.container}>
          <ConnectedHeader
            username={connectedUsername}
            onDisconnect={disconnect}
            menuState={menuState}
            onMenu={() => setMenuState(0)}
          />

          {menuState === 0 ? (
            <MenuSelection onMenuChoose={setMenuState} />
          ) : menuState === 1 ? (
            <ListNewGames />
          ) : menuState === 2 ? (
            <ListMyGames />
          ) : (
            <CreateNewGame />
          )}
        </View>
      )}
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

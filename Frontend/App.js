import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MonBouton from "./components/MonBouton";
import LoginForm from "./components/LoginForm";
import ConnectedHeader from "./components/ConnectedHeader";

const config = require("../config");
const { BACKEND } = config;

export default function App() {
  const [token, setToken] = useState(null);

  function connect(username, password) {
    fetch(`${BACKEND}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": BACKEND,
      },
      body: "data=" + JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data.token) {
          setToken(json.data.token);
        } else {
          alert("Bad authentification");
        }
      })
      .catch((error) => alert("Server error", error));
  }

  function disconnect() {
    setToken(null);
  }

  return (
    <View style={styles.container}>
      {!token ? (
        // If not token (user non connected)
        <LoginForm onConnect={connect}></LoginForm>
      ) : (
        // If token (user connected)
        <View style={styles.container}>
          <ConnectedHeader onDisconnect={disconnect} />

          <Text> Test </Text>
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

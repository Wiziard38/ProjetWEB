import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import LoginForm from "./components/LoginForm";
import ConnectedHeader from "./components/ConnectedHeader";

const config = require("../config");
const { BACKEND } = config;

export default function App() {
  const [token, setToken] = useState(null);
  const [loginState, setLoginState] = useState(true);
  const [errorTextValue, setErrorTextValue] = useState("");
  const [connectedUsername, setConnectedUsername] = useState("");

  function connect(username, password) {
    const loginURL = loginState ? `${BACKEND}/login` : `${BACKEND}/signin`;
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
          if (!loginState) {
            alert(`Bienvenue ${connectedUsername}, vous avez été inscrit.`);
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

  function disconnect() {
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
          loginState={loginState}
          setLoginState={setLoginState}
        />
      ) : (
        // If token (user connected)
        <View style={styles.container}>
          <ConnectedHeader
            username={connectedUsername}
            onDisconnect={disconnect}
          />

          <Text>Test</Text>
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

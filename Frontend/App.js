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
  const [errorTextValue, setErrorTextValue] = useState('');
  const [username, setUsername] = useState('');

  function connect(username, password) {
    fetch(`${BACKEND}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": BACKEND,
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data.token) {
          setErrorTextValue("")
          setUsername(json.data.username)
          setToken(json.data.token);
        } else {
          setErrorTextValue("Mauvais identifiants")
        }
      })
      .catch((error) => {setErrorTextValue("Mauvais identifiants")});
  }

  function signin(username, password) {
    fetch(`${BACKEND}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": BACKEND,
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data.token) {
          setErrorTextValue("")
          setUsername(json.data.username)
          setToken(json.data.token);
        } else {
          setErrorTextValue("Mauvais identifiants")
        }
      })
      .catch((error) => {setErrorTextValue("Mauvais identifiants")});
  }

  function disconnect() {
    setToken(null);
  }

  function switchLoginMode() {
    setLoginState(!loginState)
  }


  return (
    <View style={styles.container}>
      {!token ? (
        // If no token (user non connected)
        <LoginForm onConnect={connect} errorTextValue={errorTextValue} mode={loginState} changeMode={switchLoginMode}></LoginForm>
      ) : (
        // If token (user connected)
        <View style={styles.container}>
          <ConnectedHeader username={username} onDisconnect={disconnect} />

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

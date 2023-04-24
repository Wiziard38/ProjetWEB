import { useState, useRef, React, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, Pressable } from "react-native";
import SocketIOClient, { connect } from 'socket.io-client';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LoginForm,
  MenuSelection,
  ConnectedHeader,
  CreateNewGame,
  ListNewGames,
  ListMyGames,
  DisplayMessage,
  Game,
} from "./components";

import { fetchData } from "./utils/fetchData";

const config = require("./config.js");
const { BACKEND } = config;

export default function App() {
  const [role, setRole] = useState(null);
  const [team, setTeam] = useState(null);
  const [testName, setTestName] = useState(null);
  const [socket, setSocket] = useState(null);
  const [pasFouSinon, setPasFouSinon] = useState(null);

  useEffect( () => {
    if(socket) {
      socket.on('connect', () => {
        console.log('Connected to server');
        // socket.emit('proposal', 'bin voui c ez');
      })
      socket.on('disconnect', () => {
        console.log('disconnect');
      })
      socket.on('game_data', (msg) => {
        // console.log(msg);
      })
      //TODO DELETE_ALL_TEST_MSG
      socket.on('info_TEST', (userName, role, team) => {
        // console.log("=================== INFO TEST ===========");
        // console.log("Test");
        // console.log(role);
        setRole(role);
        setTeam(team);
        setTestName(userName);
        console.log('userName : ' + userName + ", role : " + role + ", team : " + team);
      })

      socket.on("receive_msg", (msg) => {
        console.log(msg);
      })

      socket.on("jour", (msg) => {
        console.log(msg);
      })

      socket.on("nuit", (msg) => {
        console.log(msg);
      })

      socket.on("begin", (msg) => {
        console.log(msg)
      })
    }
  }, [socket]);
  
  function connection() {
    if(socket !== null) {
      socket.disconnect();
    }
    if(pasFouSinon !== null) {
      clearInterval(pasFouSinon);
      setPasFouSinon(null);
    }
    setSocket(SocketIOClient('http://localhost:3000/0'))
  }
  function emission() {
    socket.emit("message", "Je suis : " + testName + ", mon role : " + role + ", ma team : " + team);    
  }
    // <View style={styles.container}>
    //   <Text>Press button to open connection</Text>
    //  <Pressable onPress={() => {connection()}}><Text style={styles.buttonLabel}>Connect</Text></Pressable>
    //  <Pressable onPress={() => {emission()}}><Text style={styles.buttonLabel}>Message</Text></Pressable>
    // </View>
    const [token, setToken] = useState(null);
    const [loggingState, setLoggingState] = useState(true);
    const [menuState, setMenuState] = useState(0);
    const [errorTextValue, setErrorTextValue] = useState("");
    const [connectedUsername, setConnectedUsername] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [joinedGame, setJoinedGame] = useState(null);
  
    useEffect(() => {
      // Si le token existe deja a la connexion
      console.log("Trying to retrieve token...");
      AsyncStorage.getItem("token").then((retrievedToken) => {
        if (retrievedToken != null) {
          fetchData("whoami", "GET")
            .then((json) => {
              if (json.username != null) {
                setConnectedUsername(json.username);
                setToken(retrievedToken);
                console.log("Retrieved !");
              } else {
                console.log("No token found.");
              }
            })
            .catch((error) => console.log(error));
        }
      });
    }, []);
  
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
            setConnectedUsername(json.data.username);
            setToken(json.data.token);
            AsyncStorage.setItem("token", json.data.token)
              .then(() => console.log("Token stored successfully"))
              .catch((error) => console.log(error));
            if (!loggingState) {
              setModalVisible(true);
              setErrorTextValue(
                `Bienvenue ${json.data.username}, vous avez été inscrit avec succès.`
              );
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
      setLoggingState(true);
      setErrorTextValue("");
      setConnectedUsername("");
    }
  
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
        <StatusBar translucent={false} backgroundColor="white" />
  
        <DisplayMessage
          visible={modalVisible}
          textMessage={errorTextValue}
          onPress={() => setModalVisible(false)}
        />
  
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
          <View style={[styles.container, { backgroundColor: "white" }]}>
            <ConnectedHeader
              username={connectedUsername}
              onDisconnect={disconnect}
              menuState={menuState}
              onMenu={() => setMenuState(0)}
            />
  
            {menuState === 0 ? (
              <MenuSelection onMenuChoose={setMenuState} />
            ) : menuState === 1 ? (
              <ListNewGames
                setMenuState={setMenuState}
                onDisconnect={disconnect}
              />
            ) : menuState === 2 ? (
              <ListMyGames
                setMenuState={setMenuState}
                onDisconnect={disconnect}
                setJoinedGame={setJoinedGame}
              />
            ) : menuState === 3 ? (
              <CreateNewGame
                setMenuState={setMenuState}
                onDisconnect={disconnect}
              />
            ) : (
              <Game gameId={joinedGame} />
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
  

import { useState, useRef, React, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, Pressable } from "react-native";
import SocketIOClient, { connect } from 'socket.io-client';
const config = require("./config.js");
const { BACKEND } = config;

export default function App() {
  const [role, setRole] = useState(null);
  const [team, setTeam] = useState(null);
  const [testName, setTestName] = useState(null);
  const [socket, setSocket] = useState(null);
  const [pasFouSinon, setPasFouSinon] = useState(null);
  //const socket = useRef(SocketIOClient('http://localhost:3000/0')).current;
  // useEffect(() => {

  //   socket.on('connect', () => {
  //     console.log('Connected to server');
  //     // socket.emit('proposal', 'bin voui c ez');
  //   })
    
  //   socket.on('game_data', (msg) => {
  //     // console.log(msg);
  //   })
  //   //TODO DELETE_ALL_TEST_MSG
  //   socket.on('info_TEST', (userName, role, team) => {
  //     // console.log("=================== INFO TEST ===========");
  //     // console.log("Test");
  //     // console.log(role);
  //     setRole(role);
  //     setTeam(team);
  //     setTestName(userName);
  //     console.log('userName : ' + userName + ", role : " + role + ", team : " + team);
  //   })
  // });
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
  return (
    <View style={styles.container}>
      <Text>Press button to open connection</Text>
     <Pressable onPress={() => {connection()}}><Text style={styles.buttonLabel}>Connect</Text></Pressable>
     <Pressable onPress={() => {emission()}}><Text style={styles.buttonLabel}>Message</Text></Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: "white",
    backgroundColor: "black",
    borderRadius:10,
    padding: 10,
    borderWidth: 2,
    borderColor: "red",
  }
});
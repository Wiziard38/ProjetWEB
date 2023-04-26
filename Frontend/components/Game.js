import { React, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";


import SocketIOClient, { connect } from 'socket.io-client';

export default function CreateNewGame({ gameId, token }) {
  // TODO
  const [role, setRole] = useState(null);
  const [team, setTeam] = useState(null);
  const [testName, setTestName] = useState(null);
  const [message, setMessage] = useState("");

  const socket = useRef(SocketIOClient('http://localhost:3000/0', {
    auth: {
      token: token
    }
  }));

  useEffect( () => {
    if(socket.current) {
      socket.current.on('connect', () => {
        console.log('Connected to server');null
        // socket.emit('proposal', 'bin voui c ez');
      })
      socket.current.on('disconnect', () => {
        console.log('disconnect');
      })
      socket.current.on('game_data', (msg) => {
        // console.log(msg);
      })
      //TODO DELETE_ALL_TEST_MSG
      socket.current.on('info_TEST', (userName, role, team) => {
        setRole(role);
        setTeam(team);
        setTestName(userName);
        console.log('userName : ' + userName + ", role : " + role + ", team : " + team);
      })

      socket.current.on("receive_msg", (msg) => {
        console.log(msg);
      })

      socket.current.on("jour", (msg) => {
        console.log(msg);
      })

      socket.current.on("nuit", (msg) => {
        console.log(msg);
      })

      socket.current.on("begin", (msg) => {
        console.log(msg)
      })
    }
  }, []);
  
  function emission() {
    socket.current.emit("message", "Je suis : " + testName + ", mon role : " + role + ", ma team : " + team);    
  }
  return (
    <View style={styles.container}>
      <Text>Press button to send message</Text>
      <TextInput
        nativeID="message"
        style={styles.input}/>
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
  }
});

CreateNewGame.propTypes = {
  gameId: PropTypes.number.isRequired,
};

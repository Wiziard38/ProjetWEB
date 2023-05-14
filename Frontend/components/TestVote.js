import React, {useRef, useEffect} from "react";
import { StyleSheet, View,  } from "react-native";
import SizedButton from "./SizedButton";
import PropTypes from "prop-types";
import SocketIOClient,  {connect} from "socket.io-client";

export default function TestVote({}) {
    const socket = useRef(SocketIOClient('http://192.168.246.101:3000/1'));
    return (
        <View style={styles.container}>
        <SizedButton
            buttonLabel={"Voter pour le méchant"}
            onPress={() => {socket.current.emit("propVote", "DarkJL", "Luca")}}
            size={"mini"}
            buttonStyle={styles.headerButton}
            buttonLabelStyle={styles.headerButtonLabel}
        />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  headerButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
    marginHorizontal: 5,
  },
  headerButtonLabel: {
    color: "white",
  },
});
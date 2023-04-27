import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import SizedButton from "../SizedButton";

export default function MessagesScreen({ setMenuShow }) {

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={() => setMenuShow(false)}>
        <Image
          style={styles.closeImage}
          source={require("../../assets/images/close.png")}
          resizeMethod="scale"
          resizeMode="contain"
        />
      </Pressable>
      <SizedButton
        buttonLabel="Infos partie"
        onPress={() => console.log("infos partie")}
        size="large"
        buttonStyle={styles.menuButton}
        buttonLabelStyle={styles.menuButtonText}
      />
      <SizedButton
        buttonLabel="Votes"
        onPress={() => console.log("votes")}
        size="large"
        buttonStyle={styles.menuButton}
        buttonLabelStyle={styles.menuButtonText}
      />
      <SizedButton
        buttonLabel="Pouvoir"
        onPress={() => console.log("pouvoir")}
        size="large"
        buttonStyle={styles.menuButton}
        buttonLabelStyle={styles.menuButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  menuButton: {
    backgroundColor: "#eee",
    width: 150,
    padding: 10,
    borderRadius: 5,
    borderColor: "black",
    overflow: "hidden",
    marginTop: 10,
  },
  menuButtonText: {
    textAlign: "right",
    color: "#000",
  },
  closeImage: {
    width: 20,
    height: 20,
  },
  closeButton: {
    padding: 5,
  }
});

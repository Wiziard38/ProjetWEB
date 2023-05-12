import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import SizedButton from "../SizedButton";

export default function GameMenuDepth1({ setMenuDepth, setMenuSelection }) {
  const [power, setPower] = useState(null);

  const handlePress = (selection) => {
    setMenuSelection(selection);
    setMenuDepth(2);
  };

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      // TODO recup le pouvoir
      setPower("Spiritisme");
      // setPower(null);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={() => setMenuDepth(0)}>
        <Image
          style={styles.closeImage}
          source={require("../../assets/images/close.png")}
          resizeMethod="scale"
          resizeMode="contain"
        />
      </Pressable>
      <SizedButton
        buttonLabel="Infos partie"
        onPress={() => handlePress("infos")}
        size="large"
        buttonStyle={styles.menuButton}
        buttonLabelStyle={styles.menuButtonText}
      />
      <SizedButton
        buttonLabel="Votes"
        onPress={() => handlePress("votes")}
        size="large"
        buttonStyle={styles.menuButton}
        buttonLabelStyle={styles.menuButtonText}
      />
      {power !== null && (
        <SizedButton
          buttonLabel="Pouvoir"
          onPress={() => handlePress("power")}
          size="large"
          buttonStyle={styles.menuButton}
          buttonLabelStyle={styles.menuButtonText}
        />
      )}
      <SizedButton
        buttonLabel="Règles du jeu"
        onPress={() => handlePress("rules")}
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
  },
});

GameMenuDepth1.propTypes = {
  setMenuDepth: PropTypes.func.isRequired,
  setMenuSelection: PropTypes.func.isRequired,
};

import React, { useContext } from "react";
import { View, StyleSheet, Image, Pressable, Platform } from "react-native";
import PropTypes from "prop-types";
import SizedButton from "../SizedButton";
import GameContext from "./GameContext";

export default function GameMenuDepth1({ setMenuDepth, setMenuSelection }) {
  const gameInfos = useContext(GameContext);

  const handlePress = (selection) => {
    setMenuSelection(selection);
    setMenuDepth(2);
  };

  const menuWidth = Platform.OS === "web" ? 300 : 150;
  const menuStyle = { ...styles.menuButton, width: menuWidth };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={() => setMenuDepth(0)}>
        <Image
          testID="closeInGameMenu"
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
        buttonStyle={menuStyle}
        buttonLabelStyle={styles.menuButtonText}
      />
      {gameInfos.role !== "mort" && (
        <>
          {(gameInfos.isDay || gameInfos.role === "loup-garou") && (
            <SizedButton
              buttonLabel="Votes"
              onPress={() => handlePress("votes")}
              size="large"
              buttonStyle={menuStyle}
              buttonLabelStyle={styles.menuButtonText}
            />
          )}
          {(gameInfos.power !== null && !gameInfos.isDay) && (
            <SizedButton
              buttonLabel="Pouvoir"
              onPress={() => handlePress("power")}
              size="large"
              buttonStyle={menuStyle}
              buttonLabelStyle={styles.menuButtonText}
            />
          )}
        </>
      )}
      <SizedButton
        buttonLabel="Règles du jeu"
        onPress={() => handlePress("rules")}
        size="large"
        buttonStyle={menuStyle}
        buttonLabelStyle={styles.menuButtonText}
      />
      {gameInfos.role === "mort" && (
        <SizedButton
          buttonLabel="Archives"
          onPress={() => handlePress("archive")}
          size="large"
          buttonStyle={menuStyle}
          buttonLabelStyle={styles.menuButtonText}
        />
      )}
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

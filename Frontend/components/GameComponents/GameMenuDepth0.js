import React, { useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Pressable, Image, Keyboard } from "react-native";
import GameMenuDepth1 from "./GameMenuDepth1";
import GameMenuDepth2 from "./GameMenuDepth2";

export default function GameMenu({ menuDepth, setMenuDepth }) {
  const [menuSelection, setMenuSelection] = useState(null);

  const menuButtonStyle =
    menuDepth === 0
      ? styles.menuDepth0
      : menuDepth === 1
      ? styles.menuDepth1
      : styles.menuDepth2;

  return (
    <>
      <View style={[styles.menuButton, menuButtonStyle]}>
        {menuDepth === 0 ? (
          <Pressable
            onPress={() => {
              setMenuDepth(1);
              Keyboard.dismiss();
            }}
          >
            <Image
              style={styles.menuImage}
              source={require("../../assets/images/menu.png")}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </Pressable>
        ) : menuDepth === 1 ? (
          <GameMenuDepth1
            setMenuDepth={setMenuDepth}
            setMenuSelection={setMenuSelection}
          />
        ) : (
          <GameMenuDepth2
            setMenuDepth={setMenuDepth}
            menuSelection={menuSelection}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  menuWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 100,
  },
  menuDepth0: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 40,
    padding: 10,
  },
  menuDepth1: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  menuDepth2: {
    backgroundColor: "#f9b6b6ee",
    padding: 19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  menuImage: {
    width: 40,
    height: 40,
    margin: 10,
  },
});

GameMenu.propTypes = {
  menuDepth: PropTypes.number.isRequired,
  setMenuDepth: PropTypes.func.isRequired,
};

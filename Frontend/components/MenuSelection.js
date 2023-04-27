import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import GameSelectionButton from "./GameSelectionButton";
import PropTypes from "prop-types";

export default function MenuSelection({ onMenuChoose }) {
  return (
    <ImageBackground
      source={require("../assets/images/connected_bg.png")}
      style={styles.imageBackground}
    >
      <View style={styles.menu}>
        <GameSelectionButton
          label={"Consulter de nouvelles parties"}
          onPress={() => onMenuChoose(1)}
        />
        <GameSelectionButton
          label={"Consulter mes parties"}
          onPress={() => onMenuChoose(2)}
        />
        <GameSelectionButton
          label={"Créer une nouvelle partie"}
          onPress={() => onMenuChoose(3)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center",
  },
  menu: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    // backgroundColor: "#614f344c",
  },
});

MenuSelection.propTypes = {
  onMenuChoose: PropTypes.func.isRequired,
};

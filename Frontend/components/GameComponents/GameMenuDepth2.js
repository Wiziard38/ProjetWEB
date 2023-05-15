import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import InfosGame from "./InfosGame";
import Votes from "./Votes";
import Powers from "./Powers";
import Rules from "./Rules";
import Archives from "./Archives";

export default function GameMenuDepth2({
  socket,
  setMenuDepth,
  menuSelection,
}) {
  const windowWidth =
    Platform.OS !== "web"
      ? Dimensions.get("window").width * 0.87
      : Dimensions.get("window").width * 0.92;
  const windowHeight =
    Platform.OS !== "web"
      ? Dimensions.get("window").height * 0.73
      : Dimensions.get("window").height * 0.87;

  return (
    <View
      style={[styles.container, { width: windowWidth, height: windowHeight }]}
    >
      <Pressable style={styles.closeButton} onPress={() => setMenuDepth(0)}>
        <Image
          style={styles.closeImage}
          source={require("../../assets/images/close.png")}
          resizeMethod="scale"
          resizeMode="contain"
        />
      </Pressable>
      <View style={styles.container}>
        {menuSelection === "infos" ? (
          <InfosGame />
        ) : menuSelection === "votes" ? (
          <Votes socket={socket} />
        ) : menuSelection === "power" ? (
          <Powers />
        ) : menuSelection === "rules" ? (
          <Rules />
        ) : menuSelection === "archive" ? (
          <Archives />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: "white",
  },
  closeImage: {
    width: 20,
    height: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
});

GameMenuDepth2.propTypes = {
  setMenuDepth: PropTypes.func.isRequired,
  menuSelection: PropTypes.string.isRequired,
};

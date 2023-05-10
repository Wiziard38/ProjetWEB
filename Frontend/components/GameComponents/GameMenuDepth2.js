import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Text,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";

export default function GameMenuDepth2({ setMenuDepth, menuSelection }) {
  const windowWidth = Dimensions.get("window").width * 0.8;
  const windowHeight = Dimensions.get("window").height * 0.7;

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
      <View style={styles.tempView}>
        {/* A REMPLACER ICI PAR MENUS DE INFOS, VOTES, POUVOIR... */}
        {menuSelection === "infos" ? (
          <Text> Lister infos partie et joueur ici </Text>
        ) : menuSelection === "votes" ? (
          <Text> Affichier votes ici </Text>
        ) : menuSelection === "pouvoir" ? (
          <Text> Afficher actions pouvoir ici </Text>
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
    backgroundColor: "white",
  },
  closeImage: {
    width: 20,
    height: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  tempView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "lightgreen",
  },
});

GameMenuDepth2.propTypes = {
  setMenuDepth: PropTypes.func.isRequired,
  menuSelection: PropTypes.string.isRequired,
};

import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import SizedText from "./SizedText";
import HeaderButton from "./HeaderButton.js";
import PropTypes from "prop-types";

export default function ConnectedHeader({
  username,
  onDisconnect,
  menuState,
  onMenu,
}) {
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={styles.header}>
        <View style={styles.container}>
          {/* Greetings */}
          <SizedText
            label="Bonjour "
            size="large"
            textStyle={styles.welcomeText}
          />

          {/* Connected user's username */}
          <SizedText
            label={username}
            size="large"
            textStyle={styles.welcomeText}
          />
        </View>

        <View style={styles.container}>
          {menuState !== 0 ? (
            <HeaderButton label={"Menu"} onPress={onMenu} />
          ) : (
            <></>
          )}
          <HeaderButton label={"Deconnexion"} onPress={onDisconnect} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  header: {
    width: "100%",
    top: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(78, 78, 78)",
    padding: 10,
  },
  welcomeText: {
    color: "white",
  },
  disconnectButtonLabel: {
    color: "white",
    backgroundColor: "black",
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
  },
});

ConnectedHeader.propTypes = {
  username: PropTypes.string.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  menuState: PropTypes.number.isRequired,
  onMenu: PropTypes.function.isRequired,
};

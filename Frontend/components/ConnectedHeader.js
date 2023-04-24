import { React } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import SizedText from "./SizedText";
import SizedButton from "./SizedButton";
import PropTypes from "prop-types";

export default function ConnectedHeader({
  username,
  onDisconnect,
  menuState,
  onMenu,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        {/* User Name */}
        <Image
          style={[styles.headerIcon, { marginRight: 10 }]}
          source={require("../assets/images/user-icon.png")}
          resizeMethod="scale"
          resizeMode="contain"
        />

        <SizedText
          label={
            username.length >= 20 ? username.slice(0, 18) + "..." : username
          }
          size="xlarge"
          textStyle={styles.usernameLabel}
        />
      </View>

      <View style={styles.headerContainer}>
        {menuState !== 0 && (
          <SizedButton
            buttonLabel={"Menu"}
            onPress={onMenu}
            size={"mini"}
            buttonStyle={styles.headerButton}
            buttonLabelStyle={styles.headerButtonLabel}
          />
        )}

        <Pressable onPress={onDisconnect}>
          <Image
            style={[styles.headerIcon, { marginLeft: 10 }]}
            source={require("../assets/images/logout-icon.png")}
            resizeMethod="scale"
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 30,
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
  usernameLabel: {
    color: "white",
  },
  headerIcon: {
    width: 30,
    height: 30,
  },
  headerButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
  },
  headerButtonLabel: {
    color: "white",
  },
});

ConnectedHeader.propTypes = {
  username: PropTypes.string.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  menuState: PropTypes.number.isRequired,
  onMenu: PropTypes.func.isRequired,
};

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
            style={styles.headerUserIcon}
            source={require("../assets/user-icon.png")}
            resizeMethod="scale"
            resizeMode="contain"
          />

          {/* <SizedText
            label="Bonjour "
            size="large"
            textStyle={styles.welcomeText}
          /> */}

          <SizedText
            label={
              username.length >= 20 ? username.slice(0, 18) + "..." : username
            }
            size="large"
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
              style={styles.headerDiconnectIcon}
              source={require("../assets/logout-icon.png")}
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
  headerUserIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerDiconnectIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
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

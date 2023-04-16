import { StyleSheet, View, Pressable } from "react-native";
import Sizedtext from "./Sizedtext";

export default function ConnectedHeader({ username, onDisconnect }) {
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* Greetings */}
        <Sizedtext
          label="Bonjour "
          size="xlarge"
          textStyle={styles.welcomeText}
        />

        {/* Connected user's username */}
        <Sizedtext
          label={username}
          size="xlarge"
          textStyle={styles.welcomeText}
        />
      </View>

      <Pressable onPress={() => onDisconnect()}>
        <Sizedtext
          label={"Deconnection"}
          size="mini"
          textStyle={styles.disconnectButtonLabel}
        />
      </Pressable>
    </View>
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
    paddingHorizontal: 16,
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

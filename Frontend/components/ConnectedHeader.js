import { StyleSheet, View } from "react-native";
import MenuButton from "./MenuButton";
import ResizedText from "./ResizedText";

export default function ConnectedHeader({ onDisconnect }) {
  return (
    <View style={styles.header}>
      <ResizedText
        label="Bonjour moi"
        size="xlarge"
        textStyle={styles.welcomeText}
      />

      <MenuButton style={styles.disconnectButton} label={"Deconnection"} onPress={() => onDisconnect()} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    top: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgb(78, 78, 78)",
    padding: 5,
  },
  welcomeText: {
    color: "white",
  },  
});

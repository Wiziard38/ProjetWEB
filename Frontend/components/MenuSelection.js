import { StyleSheet, View, Text } from "react-native";
import GameSelectionButton from "./GameSelectionButton";

export default function MenuSelection({ onMenuChoose }) {
  return (
    <View style={styles.menu}>
      <GameSelectionButton label={"Consulter de nouvelles parties"} onPress={() => onMenuChoose(1)} />
      <GameSelectionButton label={"Consulter mes parties"} onPress={() => onMenuChoose(2)} />
      <GameSelectionButton label={"Créer une nouvelle partie"} onPress={() => onMenuChoose(3)} />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 25,
  },
});

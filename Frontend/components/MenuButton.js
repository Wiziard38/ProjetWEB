import { StyleSheet, View, Pressable } from "react-native";
import Sizedtext from "./Sizedtext";

export default function MenuButton({ label, onPress }) {
  return (
    <View>
      <Pressable onPress={onPress}>
        <Sizedtext label={label} size="mini" textStyle={styles.buttonLabel} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonLabel: {
    color: "white",
    backgroundColor: "black",
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
  },
});

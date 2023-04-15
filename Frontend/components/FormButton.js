import { StyleSheet, View, Pressable } from "react-native";
import ResizedText from "./ResizedText";

export default function FormButton({ label, onPress }) {
  return (
    <View>
      <Pressable onPress={onPress}>
        <ResizedText label={label} size="normal" textStyle={styles.buttonLabel} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonLabel: {
    color: "white",
    backgroundColor: "black",
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: "red",
    marginTop: 15,
  },
});

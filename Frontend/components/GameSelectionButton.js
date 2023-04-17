import { StyleSheet, View } from "react-native";
import SizedButton from "./SizedButton";

export default function GameSelectionButton({ label, onPress }) {
  return (
    <View style={styles.buttonStyle}>
      <SizedButton
        buttonLabel={label}
        onPress={() => onPress()}
        size={"xlarge"}
        buttonStyle={styles.selectionButton}
        buttonLabelStyle={styles.selectionButtonLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginVertical: 25,
    marginHorizontal: 25,
  },
  selectionButtonLabel: {
    backgroundColor: "#4f7c7b",
    borderColor: "#000000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 4,
    textAlign: "center",
  },
  selectionButton: {
    width: "100%",
    color: "#000000",
  },
});

import { StyleSheet, View } from "react-native";
import SizedButton from "./SizedButton";

export default function HeaderButton({ label, onPress }) {
  return (
    <View style={styles.container}>
      <SizedButton
        buttonLabel={label}
        onPress={() => onPress()}
        size={"mini"}
        buttonStyle={styles.headerButton}
        buttonLabelStyle={styles.headerButtonLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
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

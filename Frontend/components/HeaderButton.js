import React from "react";
import { StyleSheet, View } from "react-native";
import SizedButton from "./SizedButton";
import PropTypes from "prop-types";

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
    marginHorizontal: 5,
  },
  headerButtonLabel: {
    color: "white",
  },
});

HeaderButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

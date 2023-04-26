import React from 'react';
import { StyleSheet, View } from "react-native";
import SizedButton from "./SizedButton";
import PropTypes from "prop-types";

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
    width: "100%",
  },
  selectionButton: {
    paddingHorizontal: 25,
    width: "100%",
  },
  selectionButtonLabel: {
    backgroundColor: "rgba(143, 190, 187, 0.597)",
    borderColor: "rgb(40, 52, 52)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    textAlign: "center",
    color: "white"
  },
});

GameSelectionButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

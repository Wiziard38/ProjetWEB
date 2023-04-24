import React from "react";
import { StyleSheet, View, Modal } from "react-native";
import SizedButton from "./SizedButton";
import SizedText from "./SizedText";
import PropTypes from "prop-types";

export default function HeaderButton({
  visible,
  textMessage,
  onPress,
}) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <SizedText
            label={textMessage}
            size="large"
            textStyle={styles.modalText}
          />

          <SizedButton
            buttonLabel="Fermer"
            onPress={onPress}
            size="large"
            buttonStyle={styles.closeButton}
            buttonLabelStyle={styles.buttonTextStyle}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 30,
    padding: 35,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: "#bdbdbd",
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
});

HeaderButton.propTypes = {
  visible: PropTypes.bool.isRequired,
  textMessage: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

import { React, useState } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import SizedText from "../SizedText";

export default function MessageFooter({
  pseudonyme,
  dateMessage,
  textMessage,
}) {
  const [mobileNumber, setMobileNumber] = useState("9999999999");
  const [bodySMS, setBodySMS] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Example to Send Text SMS on Button Click in React Native
      </Text>
      
      <Text style={styles.titleTextsmall}>Enter SMS body</Text>
      <TextInput
        value={bodySMS}
        onChangeText={(bodySMS) => setBodySMS(bodySMS)}
        placeholder={"Enter SMS body"}
        style={styles.textInput}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.buttonStyle}
        onPress={console.log("envoie")}
      >
        <Text style={styles.buttonTextStyle}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    textAlign: "center",
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  titleTextsmall: {
    marginVertical: 8,
    fontSize: 16,
  },
  buttonStyle: {
    justifyContent: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#8ad24e",
  },
  buttonTextStyle: {
    color: "#fff",
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
});

MessageFooter.propTypes = {
  pseudonyme: PropTypes.string.isRequired,
  dateMessage: PropTypes.object.isRequired,
  textMessage: PropTypes.string.isRequired,
};

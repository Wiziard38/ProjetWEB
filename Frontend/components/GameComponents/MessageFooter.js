import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  ScrollView,
  InputAccessoryView,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import SizedText from "../SizedText";
import SizedButton from "../SizedButton";

export default function MessageFooter() {
  const inputAccessoryViewID = "uniqueID";
  const [messageBody, setMessageBody] = useState("");

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //     <View style={styles.inner}>
    //       <Text style={styles.header}>Header</Text>
    //       <TextInput placeholder="Username" style={styles.textInput} />
    //       <View style={styles.btnContainer}>
    //         <Button title="Submit" onPress={() => null} />
    //       </View>
    //     </View>
    //   </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.footer}>
        <View style={styles.container}>
          <TextInput
            value={messageBody}
            onChangeText={(messageBody) => setMessageBody(messageBody)}
            placeholder={"Your message"}
            style={styles.textInput}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonStyle}
            onPress={() => console.log("envoie")}
          >
            <Image
              style={styles.sendImage}
              source={require("../../assets/images/send.png")}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles1 = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    position: "absolute",
    height: 60,
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  sendImage: {
    width: 30,
    height: 30,
  },
  buttonStyle: {
    justifyContent: "center",
    marginHorizontal: 15,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
});

MessageFooter.propTypes = {};

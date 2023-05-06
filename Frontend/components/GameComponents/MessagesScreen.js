import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import ListMessages from "./ListMessages";

export default function MessagesScreen({ setMenuDepth }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const handleSend = () => {
    if (message !== "") {
      setMessages([
        ...messages,
        { text: message, date: new Date(), sender: "me" },
      ]);
      setMessage("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "margin"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
        style={styles.container}
      >
        <ListMessages messages={messages} flatListRef={flatListRef} />

        <View style={styles.footerStyle}>
          <TextInput
            onFocus={() => setMenuDepth(0)}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            placeholder="Type a message"
            style={[
              styles.input,
              { width: Dimensions.get("window").width - 15 * 2 - 30 },
            ]}
            // multiline={true}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonStyle}
            onPress={() => {
              handleSend();
              Keyboard.dismiss();
            }}
          >
            <Image
              style={styles.sendImage}
              source={require("../../assets/images/send.png")}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footerStyle: {
    flexDirection: "row",
  },
  input: {
    padding: 10,
    height: 60,
    fontSize: 16,
    backgroundColor: "#eee",
    flexGrow: 1,
    justifyContent: "center",
    textAlignVertical: "center",
  },
  sendImage: {
    width: 30,
    height: 30,
  },
  buttonStyle: {
    justifyContent: "center",
    paddingHorizontal: 15,
    backgroundColor: "#eee",
  },
});

MessagesScreen.propTypes = {
  setMenuDepth: PropTypes.func.isRequired,
};

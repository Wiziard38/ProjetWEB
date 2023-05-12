import React, { useState, useRef, useEffect, useContext } from "react";
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
import GameContext from "./GameContext";

export default function MessagesScreen({ setMenuDepth, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);
  const gameContextValue = useContext(GameContext);

  useEffect(() => {

    if(socket.current !== null) {
      socket.current.on("receive_msg", (msg, username) => {
        console.log(username);
        console.log("new message");
        setMessages([
          ...messages,
        { text: msg, date: new Date(), sender: username },
        ])
      })
    }
    return () => {
      socket.current.off("receive_msg");
    }
  });
  const handleSend = () => {
    if (message !== "") {
      // setMessages([
      //   ...messages,
      //   { text: message, date: new Date(), sender: "me" },
      // ]);
      socket.current.emit("message", message);
      setMessage("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "margin"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
        style={styles.container}
      >
        <ListMessages
          messages={messages}
          flatListRef={flatListRef}
        />

        {(!gameContextValue.isDead || gameContextValue.isElectedSpiritism) && (
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
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

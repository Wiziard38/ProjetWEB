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
import { TextInput as WebTextInput } from "react-native-web";
import ListMessages from "./ListMessages";
import GameContext from "./GameContext";

export default function MessagesScreen({ setMenuDepth, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [needsFocus, setNeedsFocus] = useState(false);
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);
  const gameInfos = useContext(GameContext);

  useEffect(() => {
    if (socket.current !== null) {
      socket.current.on("receive_msg", (msg, username) => {
        setMessages([
          ...messages,
          { text: msg, date: new Date(), sender: username },
        ]);
      });

      socket.current.on("day", handleDayChange);
      socket.current.on("night", handleDayChange);
      socket.current.on("messages", handleMessages);
    }
    return () => {
      socket.current.off("receive_msg");
      socket.current.off("day", handleDayChange);
      socket.current.off("night", handleDayChange);
      socket.current.off("messages", handleMessages);
    };
  });

  const handleDayChange = () => {
    setMessages([]);
  };

  const handleMessages = (msg) => {
    const messageList = JSON.parse(msg);
    console.log(messageList);
    const transformedList = messageList.map(({ contenu, date, user }) => ({
      text: contenu,
      date: new Date(Date.parse(date)),
      sender: user,
    }));
    console.log(transformedList);

    setMessages(transformedList);
  };

  const handleSend = () => {
    if (message !== "") {
      socket.current.emit("message", message);
      setMessage("");
    }
  };
  socket.current.on("receive_msg", (msg, sender) => {
    setMessages([...messages, { text: msg, date: new Date(), sender: sender }]);
  });
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "margin"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
        style={styles.container}
      >
        <View style={{ flex: 1, paddingRight: 20 }}>
          <ListMessages
            messages={messages}
            flatListRef={flatListRef}
            noMessageText={
              gameInfos.role === "mort"
                ? "Il n'y a pas encore de messages envoyés pour l'instant"
                : "Soyez le premier a envoyer un message !"
            }
          />
        </View>

        {(gameInfos.role !== "mort" || gameInfos.isElectedSpiritism) && (
          <View style={styles.footerStyle}>
            {Platform.OS === "web" ? (
              <WebTextInput
                testID="messageInput"
                ref={textInputRef}
                onFocus={() => {
                  setMenuDepth(0);
                  setNeedsFocus(true);
                }}
                onBlur={() => {
                  needsFocus && textInputRef.current.focus();
                  setNeedsFocus(false);
                }}
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
                placeholder="Type a message"
                style={[
                  styles.input,
                  { width: Dimensions.get("window").width - 15 * 2 - 30 },
                ]}
              />
            ) : (
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
              />
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => {
                handleSend();
                Keyboard.dismiss();
              }}
            >
              <Image
                testID="sendMessage"
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
  socket: PropTypes.object.isRequired,
};

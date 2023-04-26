import React, { useState, useEffect, useRef } from "react";
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

export default function MessagesScreen({}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (flatListRef.current._listRef._totalCellsMeasured !== 0) {
          flatListRef.current.scrollToEnd({ animated: true, duration: 100 });
        // flatListRef.current.scrollToOffset({
        //   offset: -flatListRef.current._listRef._scrollMetrics.dOffset,
        // });
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

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
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ListMessages
          messages={messages}
          flatListRef={flatListRef}
        />

        <View style={styles.footerStyle}>
          <TextInput
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
  // footerStyle: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginBottom: 10,
  //   marginHorizontal: 5,
  //   paddingHorizontal: 10,
  //   backgroundColor: "#fff",
  //   borderRadius: 25,
  //   height: 60,
  //   flex: 1,
  // },
  // input: {
  //   padding: 10,
  //   height: 50,
  //   fontSize: 16,
  //   backgroundColor: "#eee",
  //   marginLeft: 15,
  //   marginRight: 10,
  //   borderRadius: 25,
  //   flex: 1,
  // },
});

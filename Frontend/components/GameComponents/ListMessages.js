import React, { useRef, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import SizedText from "../SizedText";
import PropTypes from "prop-types";
import { messageTime } from "../../utils/dateFunctions";

export default function ListMessages({ messages, flatListRef }) {
  
  class Message extends React.PureComponent {
    render() {
      return (
        <TouchableOpacity onPress={() => null} style={styles.item}>
          <View style={styles.messageHeader}>
            <SizedText
              label={this.props.item.sender}
              size="normal"
              textStyle={styles.senderStyle}
            />
            <SizedText
              label={messageTime(this.props.item.date)}
              size="small"
              textStyle={styles.dateStyle}
            />
          </View>
          <View style={styles.messageBody}>
            <SizedText
              label={this.props.item.text}
              size="small"
              textStyle={styles.messageTextStyle}
            />
          </View>
        </TouchableOpacity>
      );
    }
  }

  _renderItem = ({ item }) => <Message item={item} />;


  function noGames() {
    return (
      <SizedText
        label={"Soyez le premier a envoyer un message !"}
        size={"normal"}
        textStyle={styles.item}
      />
    );
  }

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={this._renderItem}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={noGames}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  messageHeader: {
    flex: 1,
    flexDirection: "row",
  },
  senderStyle: {
    fontWeight: "bold",
  },
  dateStyle: {
    color: "gray",
    marginLeft: 5,
  },
  messageBody: {
    border: 1,
    borderColor: "gray",
    backgroundColor: "#ffffff",
  },
  messageTextStyle: {},
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 6,
    marginHorizontal: 15,
    backgroundColor: "#f9b6b6",
  },
});

ListMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  flatListRef: PropTypes.object.isRequired,
};

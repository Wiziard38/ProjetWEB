import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import SizedText from "../SizedText";
import PropTypes from "prop-types";
import Message from "./Message";

export default function ListMessages({ messages, flatListRef }) {
  const renderItem = ({ item }) => <Message item={item} />;

  function noGames() {
    return (
      <SizedText
        label={"Soyez le premier a envoyer un message !"}
        size={"normal"}
        textStyle={styles.noMessage}
      />
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={noGames}
        onContentSizeChange={() => {
          if (flatListRef.current._listRef._totalCellsMeasured !== 0) {
            flatListRef.current.scrollToEnd();
          }
        }}
        onLayout={() => {
          if (flatListRef.current._listRef._totalCellsMeasured !== 0) {
            flatListRef.current.scrollToEnd({ animated: true, velocity: 1 });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: "lightblue",
    paddingRight: 20,
    paddingTop: 10,
  },
  noMessage: {
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

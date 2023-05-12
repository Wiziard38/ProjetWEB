import React, { useContext } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import SizedText from "../SizedText";
import PropTypes from "prop-types";
import Message from "./Message";
import GameContext from "./GameContext";

export default function ListMessages({ messages, flatListRef, isDead }) {
  const renderItem = ({ item }) => <Message item={item} />;
  const gameInfos = useContext(GameContext);

  function noGames() {
    return (
      <SizedText
        label={
          gameInfos.isDead
            ? "Il n'y a pas encore de messages envoyés pour l'instant"
            : "Soyez le premier a envoyer un message !"
        }
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
    paddingRight: 20,
    paddingTop: 10,
  },
  noMessage: {
    paddingVertical: 5,
    paddingLeft: 15,
    paddingRight: 50,
    marginVertical: 6,
    marginHorizontal: 15,
    backgroundColor: "#ffffffcc",
  },
});

ListMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  flatListRef: PropTypes.object.isRequired,
};

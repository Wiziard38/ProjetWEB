import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import SizedText from "../SizedText";
import PropTypes from "prop-types";
import { messageTime } from "../../utils/dateFunctions";

export default class Message extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={() => null} style={styles.itemContainer}>
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

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginVertical: 6,
    marginHorizontal: 15,
    backgroundColor: "#ffffffcc",
  },
  messageHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  senderStyle: {
    fontWeight: "bold",
  },
  dateStyle: {
    color: "gray",
    marginLeft: 5,
  },
  messageBody: {
    paddingTop: 5,
    marginTop: 2,
    borderTopWidth: 1,
    borderColor: "#b5b5b5",
  },
  messageTextStyle: {},
});

Message.propTypes = {
  item: PropTypes.object.isRequired,
};

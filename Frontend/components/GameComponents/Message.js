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
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 6,
    marginHorizontal: 15,
    backgroundColor: "#f9b6b6",
  },
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
});

Message.propTypes = {
  item: PropTypes.object.isRequired,
};

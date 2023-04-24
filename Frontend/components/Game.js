import { React } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";

export default function CreateNewGame({ gameId }) {
  // TODO

  return (
    <View style={styles.container}>
      <Text>
        A implémenter ; toute la phase de jeu avec vote, messages, infos...

        Partie actuelle : {gameId}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
});

CreateNewGame.propTypes = {
  gameId: PropTypes.number.isRequired,
};

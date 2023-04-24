import { useState, useEffect, React } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import ListGames from "./ListGames";
import DisplayMessage from "./DisplayMessage";
import { fetchData } from "../utils/fetchData";

export default function ListNewGames({ setMenuState, onDisconnect }) {
  const [parties, setParties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData("game/newgame", "GET")
      .then((json) => {
        if (json.token === false) {
          onDisconnect();
          window.alert("You are not authentified, please reconnect");
        } else {
          setParties(json);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  function joinNewGame() {
    console.log("joinNewGame : ", selectedId);
    fetchData(`game/newgame/${selectedId}`, "POST")
      .then(setModalVisible(true))
      // .then((json) => setParties(json))
      .catch((error) => console.log(error));
  }

  return (
    <View style={styles.container}>
      <DisplayMessage
        visible={modalVisible}
        textMessage={`Vous vous êtes inscrit avec succès à la partie ${selectedId}.`}
        onPress={() => {
          setModalVisible(false);
          setMenuState(0);
        }}
      />

      <ListGames
        descriptiveLabel={"Liste des parties que vous pouvez rejoindre :"}
        parties={parties}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onPress={joinNewGame}
        onPressLabel={"Je rejoins !"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
});

ListNewGames.propTypes = {
  onDisconnect: PropTypes.func.isRequired,
  setMenuState: PropTypes.func.isRequired,
};

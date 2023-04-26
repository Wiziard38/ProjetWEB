import { useState, useEffect, React } from "react";
import { StyleSheet, View } from "react-native";
import { fetchData } from "../utils/fetchData";
import DisplayMessage from "./DisplayMessage";
import ListGames from "./ListGames";
import PropTypes from "prop-types";

export default function ListMyGames({ setMenuState, onDisconnect, setJoinedGame }) {
  const [parties, setParties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData("game", "GET")
      .then((data) => {
        if (data.token === false) {
          onDisconnect();
          window.alert("You are not authentified, please reconnect");
        } else {
          setParties(data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  function joinMyGame() {
    console.log("joinMyGame : ", selectedId);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <DisplayMessage
        visible={modalVisible}
        textMessage={`Vous rejoignez la partie ${selectedId}. Bon jeu !`}
        onPress={() => {
          setModalVisible(false);
          setMenuState(4);
          setJoinedGame(selectedId);
        }}
      />

      <ListGames
        descriptiveLabel={
          "Liste des parties auxquelles vous participez déjà : (TODO)"
        }
        parties={parties}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onPress={joinMyGame}
        onPressLabel={"Je lance la partie"}
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

ListMyGames.propTypes = {
  onDisconnect: PropTypes.func.isRequired,
  setMenuState: PropTypes.func.isRequired,
  setJoinedGame: PropTypes.func.isRequired,
};

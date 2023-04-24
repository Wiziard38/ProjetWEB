import { useState, useEffect, React } from "react";
import { StyleSheet, View } from "react-native";
import ListGames from "./ListGames";
import { fetchData } from "../utils/fetchData";
import PropTypes from "prop-types";

export default function ListNewGames({ onDisconnect }) {
  const [parties, setParties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchData("game/newgame", "GET")
      .then((json) => {
        if (json.token === false) {
          onDisconnect();
          window.alert("You are not authentified, please reconnect");
        } else {
          console.log(json)
          setParties(json);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  function joinNewGame() {
    console.log("joinNewGame");
    fetchData(`game/newgame/${selectedId}`, "POST")
      // .then((json) => setParties(json))
      .catch((error) => console.log(error));
  }

  return (
    <View style={styles.container}>
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
};

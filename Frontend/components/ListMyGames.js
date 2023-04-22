import { useState, useEffect, React } from "react";
import { StyleSheet, View } from "react-native";
import ListParties from "./ListParties";
import { fetchData } from "../utils/fetchData";
import PropTypes from "prop-types";

// const config = require("../config");
// const { BACKEND } = config;

export default function ListMyGames({ onDisconnect }) {
  const [parties, setParties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // TODO, uniquement parties auxquelles joueur X participe
    fetchData("partie", "GET")
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
    // TODO

    console.log(selectedId);
    // fetch(`${BACKEND}/partie/${selectedId}`, {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((json) => setParties(json))
    //   .catch((error) => console.log(error));
  }

  return (
    <View style={styles.container}>
      <ListParties
        descriptiveLabel={"Liste des parties auxquelles vous participez déjà : (TODO)"}
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
};

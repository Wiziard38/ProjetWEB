import { useState, useEffect, React } from "react";
import { StyleSheet, View } from "react-native";
import ListParties from "./ListParties";
import { fetchData } from "../utils/fetchData";
import PropTypes from "prop-types";

export default function ListNewGames({ onDisconnect }) {
  const [parties, setParties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
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

  function joinNewGame() {
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

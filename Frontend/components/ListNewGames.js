import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import ListParties from "./ListParties";
import SizedText from "./SizedText";

const config = require("../config");
const { BACKEND } = config;

export default function ListNewGames() {
  const [parties, setParties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/partie`, {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((json) => setParties(json))
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
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <SizedText
          label={"Liste des parties que vous pouvez rejoindre :"}
          size={"large"}
          textStyle={styles.title}
        />
        <ListParties
          parties={parties}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onPress={joinNewGame}
          onPressLabel={"Je rejoins !"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
  },
  container: {
    margin: 15,
  },
});

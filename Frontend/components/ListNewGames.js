import { useState, useEffect, React } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import ListParties from "./ListParties";
import SizedText from "./SizedText";
import { fetchData } from "../utils/fetchData";

export default function ListNewGames() {

  console.log("ListNewGames")

  const [parties, setParties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchData("game/newgame", "GET")
    .then((data) => setParties(data))
    .catch((error) => console.log(error));
  }, []);

  function joinNewGame() {
    console.log("joinNewGame")
    fetchData(`game/newgame/${selectedId}`, "POST")
    //.then((json) => setParties(json))
    .catch((error) => console.log(error));
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

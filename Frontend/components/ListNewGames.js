import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, FlatList } from "react-native";

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

  const renderItem = (item) => {
    const backgroundColor = item.id === selectedId ? "#717171" : "white";
    const color = item.id === selectedId ? "white" : "black";

    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={[styles.item, { backgroundColor: backgroundColor }]}
      >
        <Text style={{ color: color }}>Partie n˚ {item.id}</Text>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <FlatList
        data={parties}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 15,
  },
});

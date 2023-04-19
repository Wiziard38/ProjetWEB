import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import SizedText from "./SizedText";
import SizedButton from "./SizedButton";
import PropTypes from "prop-types";

export default function ListParties({
  parties,
  onPress,
  onPressLabel,
  selectedId,
  setSelectedId,
}) {
  function selectItem(item) {
    setSelectedId(item.id);
  }

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#668687" : "#747474";
    const color = item.id === selectedId ? "white" : "black";

    return (
      <TouchableOpacity
        onPress={() => selectItem(item)}
        style={[styles.item, { backgroundColor }]}
      >
        <SizedText
          label={`Partie n˚ ${item.id}`}
          size={"large"}
          textStyle={{ color }}
        />

        {item.id === selectedId && (
          <View style={styles.itemDetails}>
            <SizedText
              label={`Nombre de joueurs : ${item.nbJoueur}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Duree du jour : ${item.dureeJour}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Nombre de la nuit : ${item.dureeNuit}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Date de debut : ${item.dateDeb}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Probabilité de pouvoir : ${item.probaPouv}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Probabilité de loup-garou : ${item.probaLoup}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />

            <SizedButton
              buttonLabel={onPressLabel}
              onPress={onPress}
              size={"normal"}
              buttonStyle={styles.joinButton}
              buttonLabelStyle={styles.joinButtonLabel}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={parties}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        style={styles.itemList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  title: {
    fontWeight: "bold",
  },
  itemList: {
    marginTop: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 6,
    marginHorizontal: 15,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "column",
    marginTop: 3,
    marginLeft: 10,
  },
  itemDetailText: {
    marginVertical: 2,
  },
  joinButton: {
    backgroundColor: "#747474",
    borderColor: "black",
    borderRadius: 4,
    borderWidth: 2,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  joinButtonLabel: {
    color: "white",
    fontWeight: "bold",
  },
});

ListParties.propTypes = {
  parties: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  onPressLabel: PropTypes.string.isRequired,
  selectedId: PropTypes.number,
  setSelectedId: PropTypes.func.isRequired,
};

import { StatusBar } from "expo-status-bar";
import { React } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SizedText from "./SizedText";
import SizedButton from "./SizedButton";
import PropTypes from "prop-types";
import { dateToText, timeToText, secondsToText } from "../utils/dateFunctions";

export default function ListGames({
  descriptiveLabel,
  parties,
  onPress,
  onPressLabel,
  selectedId,
  setSelectedId,
}) {
  const { height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight ?? 0;
  const headerHeight = 50;
  const containerVerticalMargins = 15;
  const flatListHeight =
    height - statusBarHeight - headerHeight - 2 * containerVerticalMargins;

  function selectItem(item) {
    setSelectedId(item.idGame);
  }

  function renderItem({ item }) {
    const backgroundColor = item.idGame === selectedId ? "#668687" : "#747474";
    const color = item.idGame === selectedId ? "white" : "black";

    return (
      <TouchableOpacity
        onPress={() => selectItem(item)}
        style={[styles.item, { backgroundColor }]}
      >
        <SizedText
          label={`Partie n˚ ${item.idGame}`}
          size={"large"}
          textStyle={{ color }}
        />

        {item.idGame === selectedId && (
          <View style={styles.itemDetails}>
            <SizedText
              label={`Nombre de joueurs : ${item.nbJoueur}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Duree du jour : ${secondsToText(item.dureeJour)}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Duree de la nuit : ${secondsToText(item.dureeNuit)}`}
              size={"small"}
              textStyle={styles.itemDetailText}
            />
            <SizedText
              label={`Date de debut : ${dateToText(item.dateDeb)}`}
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
  }

  function noGames() {
    return (
      <SizedText
        label={"Il n'y a pas encore de parties, vous pouvez en créer une !"}
        size={"large"}
      />
    );
  }

  return (
    <View style={{ height: flatListHeight }}>
      <SizedText
        label={descriptiveLabel}
        size={"large"}
        textStyle={styles.title}
      />
      <FlatList
        data={parties}
        renderItem={renderItem}
        keyExtractor={(item) => item.idGame}
        extraData={selectedId}
        style={styles.itemList}
        ListEmptyComponent={noGames}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
  },
  listGames: {
    flex: 1,
    margin: 10,
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

ListGames.propTypes = {
  descriptiveLabel: PropTypes.string.isRequired,
  parties: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  onPressLabel: PropTypes.string.isRequired,
  selectedId: PropTypes.number,
  setSelectedId: PropTypes.func.isRequired,
};

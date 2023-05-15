import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import SizedText from "./SizedText";
import SizedButton from "./SizedButton";
import PropTypes from "prop-types";
import DisplayMessage from "./DisplayMessage";
import { timeToText, dateToText, secondsToHHMM } from "../utils/dateFunctions";
import { fetchData } from "../utils/fetchData";

export default function ListGames({
  titleLabel,
  parties,
  onPress,
  buttonLabel,
  selectedId,
  setSelectedId,
  waiting,
  emptyListLabel,
}) {
  const { height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight ?? 0;
  const headerHeight = 50;
  const containerVerticalMargins = 15;
  const flatListHeight =
    height - statusBarHeight - headerHeight - 2 * containerVerticalMargins;
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState(
    "Etes vous sur de vouloir supprimer cette partie ? L'action est irréversible."
  );
  const [onRefresh, setOnRefresh] = useState(false);
  function selectItem(item) {
    setSelectedId(item.idGame);
  }

  useEffect(() => {
    fetchData("whoami", "GET").then((json) => {
      if (json.username != null) {
        setIsAdmin(json.admin);
      }
    });
  }, []); // Dependency array to run the effect each time mode is changed

  function confirmDeleteGame() {
    setModalVisible(true);
  }

  function deleteGame() {
    fetchData(`game/${selectedId}`, "DELETE").then((json) => {
      if (json.status) {
        setModalText("La partie a bien été supprimée");
        setModalVisible(true);
      }
      setOnRefresh(!onRefresh);
    });
  }

  function renderItem({ item }) {
    const notStarted =
      waiting && new Date(item.dateDeb).getTime() > new Date().getTime();
    const backgroundColor = notStarted
      ? "#e89a9a"
      : item.idGame === selectedId
      ? "#668687"
      : "#747474";
    const color = notStarted
      ? "black"
      : item.idGame === selectedId
      ? "white"
      : "black";

    return (
      <TouchableOpacity
        onPress={() => selectItem(item)}
        style={[styles.item, { backgroundColor }]}
      >
        <View style={styles.columnSeparator}>
          <View style={styles.contentContainer}>
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
                  label={`Duree du jour : ${secondsToHHMM(item.dureeJour)}`}
                  size={"small"}
                  textStyle={styles.itemDetailText}
                />
                <SizedText
                  label={`Duree de la nuit : ${secondsToHHMM(item.dureeNuit)}`}
                  size={"small"}
                  textStyle={styles.itemDetailText}
                />
                <SizedText
                  label={`Date de debut : ${dateToText(
                    item.dateDeb
                  )} à ${timeToText(item.dateDeb)}`}
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

                <View style={styles.footerButtons}>
                  {!notStarted && (
                    <SizedButton
                      buttonLabel={buttonLabel}
                      onPress={onPress}
                      size={"normal"}
                      buttonStyle={styles.joinButton}
                      buttonLabelStyle={styles.joinButtonLabel}
                    />
                  )}
                  {isAdmin && (
                    <SizedButton
                      buttonLabel="Je supprime"
                      onPress={confirmDeleteGame}
                      size={"normal"}
                      buttonStyle={[
                        styles.joinButton,
                        { backgroundColor: "#c84f4f" },
                      ]}
                      buttonLabelStyle={styles.joinButtonLabel}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
          {notStarted && (
            <Image
              style={styles.waitIcon}
              source={require("../assets/images/wait-clock.png")}
              resizeMethod="scale"
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  function noGames() {
    return <SizedText label={emptyListLabel} size="large" />;
  }

  return (
    <View style={{ height: flatListHeight }}>
      <DisplayMessage
        visible={modalVisible}
        textMessage={modalText}
        onPress={() => {
          setModalVisible(false);
          deleteGame();
        }}
      />
      <SizedText label={titleLabel} size={"large"} textStyle={styles.title} />
      <FlatList
        key={onRefresh}
        testID="listGames"
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
  columnSeparator: {
    flex: 1,
    flexDirection: "row",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  waitIcon: {
    height: 20,
    width: 20,
  },
  footerButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

ListGames.propTypes = {
  titleLabel: PropTypes.string.isRequired,
  parties: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  selectedId: PropTypes.number,
  setSelectedId: PropTypes.func.isRequired,
  waiting: PropTypes.bool.isRequired,
  emptyListLabel: PropTypes.string.isRequired,
};

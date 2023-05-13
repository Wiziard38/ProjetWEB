import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import SizedText from "../SizedText";
import SizedButton from "../SizedButton";
import ListMessages from "./ListMessages";

export default function Archives() {
  const [selectedId, setSelectedId] = useState(null);
  const [consulting, setConsulting] = useState(false);
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  // TODO recup archives
  const archives = [
    { idArchive: 1, label: "Jour1" },
    { idArchive: 2, label: "Jour2" },
    { idArchive: 3, label: "Jour3" },
    { idArchive: 4, label: "Nuit1" },
    { idArchive: 5, label: "Nuit2" },
    { idArchive: 6, label: "Nuit3" },
    { idArchive: 7, label: "Spiritisme nuit 1" },
    { idArchive: 8, label: "Spiritisme nuit 2" },
    { idArchive: 9, label: "Spiritisme nuit 3" },
  ];

  function selectItem(item) {
    setSelectedId(item.idArchive);
  }

  function openArchive() {
    setConsulting(true);
    // TODO recup les messages
    setMessages([
      {
        text: "testj fww nmHUIHUE n78923b YY78ikh DBEK",
        date: new Date(),
        sender: "me",
      },
      { text: "test1", date: new Date(), sender: "yoyoyoy129" },
      { text: "test2", date: new Date(), sender: "yoyoyoy129" },
      { text: "test3", date: new Date(), sender: "yoyoyoy129" },
      { text: "test4", date: new Date(), sender: "yoyoyoy129" },
      { text: "test5", date: new Date(), sender: "yoyoyoy129" },
      {
        text: "test32 fwehewilf wejflew welfwef ewf elwfjewlf wjeflewfjk lwfj ekwl",
        date: new Date(),
        sender: "SWAGGG",
      },
    ]);
  }

  function renderItem({ item }) {
    const backgroundColor =
      item.idArchive === selectedId ? "#668687" : "#747474";
    const color = item.idArchive === selectedId ? "white" : "black";

    return (
      <TouchableOpacity
        onPress={() => selectItem(item)}
        style={[styles.item, { backgroundColor }]}
      >
        <View style={styles.contentContainer}>
          <SizedText
            label={`Archive ${item.label}`}
            size={"large"}
            textStyle={{ color }}
          />

          {item.idArchive === selectedId && (
            <SizedButton
              buttonLabel="Consulter"
              onPress={openArchive}
              size={"normal"}
              buttonStyle={styles.joinButton}
              buttonLabelStyle={styles.joinButtonLabel}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  function noArchive() {
    return <SizedText label={emptyListLabel} size="large" />;
  }

  return (
    <View style={styles.container}>
      {consulting ? (
        <>
          <View style={styles.archiveTitle}>
            <SizedText
              label={`${
                archives.find((archive) => archive.idArchive === selectedId)
                  .label
              }`}
              size="xlarge"
              textStyle={styles.title}
            />

            <Pressable
              onPress={() => {
                setSelectedId(null);
                setConsulting(false);
              }}
            >
              <Image
                style={styles.returnImage}
                source={require("../../assets/images/return.png")}
                resizeMethod="scale"
                resizeMode="contain"
              />
            </Pressable>
          </View>
          <ListMessages
            messages={messages}
            flatListRef={flatListRef}
            noMessageText="Aucun message n'a été envoyé dans cette archive !"
          />
        </>
      ) : (
        <>
          <SizedText
            label="Liste des discussions archivées"
            size="xlarge"
            textStyle={styles.title}
          />

          <FlatList
            data={archives}
            renderItem={renderItem}
            keyExtractor={(item) => item.idArchive}
            extraData={selectedId}
            ListEmptyComponent={noArchive}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffffaa",
    padding: 10,
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 7,
  },
  listGames: {
    flex: 1,
    margin: 10,
  },
  item: {
    paddingVertical: 7,
    paddingHorizontal: 3,
    marginVertical: 1,
    marginHorizontal: 3,
  },
  joinButton: {
    backgroundColor: "#747474",
    borderColor: "black",
    borderRadius: 4,
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  joinButtonLabel: {
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  archiveTitle: {
    flex: 1,
    maxHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  returnImage: {
    width: 30,
    height: 30,
  },
});

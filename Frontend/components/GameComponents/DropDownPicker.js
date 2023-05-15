import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import SizedText from "../SizedText";

export default function DropDownPicker({
  open,
  setOpen,
  players,
  selectedPlayer,
  setSelectedPlayer,
  emptyListLabel,
  openDirection,
  onOpenTrigger,
}) {
  const pickerMaxHeight = 180;
  const [flatListHeight, setFlatListHeight] = useState(pickerMaxHeight);
  const [computedPickerHeight, setComputedPickerHeight] = useState(50);
  const flatListRef = useRef(null);

  function selectItem(item) {
    setSelectedPlayer(item);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          selectItem(item.value);
          setOpen(false);
        }}
        style={styles.item}
      >
        <View style={styles.contentContainer}>
          <SizedText
            label={item.label}
            size={"normal"}
            textStyle={styles.item}
          />

          {item.label === selectedPlayer && (
            <Image
              style={styles.checkImage}
              source={require("../../assets/images/check.png")}
              resizeMethod="scale"
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <>
      {players.length > 0 ? (
        <View
          style={[
            styles.container,
            openDirection === "TOP"
              ? { flexDirection: "column-reverse", marginTop: -flatListHeight }
              : { flexDirection: "column", marginBottom: -flatListHeight },
            open && { zIndex: 8888 },
            {
              height:
                Platform.OS === "web"
                  ? 60 + flatListHeight
                  : 50 + flatListHeight,
            },
          ]}
        >
          <Pressable
            style={[
              styles.pickerStyle,
              open && { backgroundColor: "#800000b8" },
            ]}
            onPress={() => {
              onOpenTrigger && onOpenTrigger();
              setOpen(!open);
            }}
          >
            <SizedText
              label={
                selectedPlayer === null ? "Choisir un joueur" : selectedPlayer
              }
              size="normal"
              textStyle={styles.pickerLabelStyle}
            />
            <Image
              style={[
                styles.chevronImage,
                {
                  transform: [
                    {
                      rotate: open
                        ? openDirection === "TOP"
                          ? "-90deg"
                          : "90deg"
                        : "0deg",
                    },
                  ],
                },
              ]}
              source={require("../../assets/images/chevron.png")}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </Pressable>

          {open && (
            <View style={{ height: flatListHeight }}>
              <FlatList
                ref={flatListRef}
                data={players}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
                extraData={selectedPlayer}
                contentContainerStyle={{ flexGrow: 1 }}
                style={[
                  styles.flatlistView,
                  openDirection === "TOP"
                    ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
                    : {
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                      },
                ]}
                onLayout={() => {
                  if (flatListRef.current) {
                    const listHeight =
                      flatListRef.current?._listRef?._totalCellLength || 0;
                    setFlatListHeight(Math.min(listHeight, pickerMaxHeight));
                  }
                }}
              />
            </View>
          )}
        </View>
      ) : (
        <SizedText
          label={emptyListLabel}
          size="normal"
          textStyle={styles.emptyList}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    minWidth: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
    height: 50,
  },
  item: {
    paddingVertical: 5,
    paddingRight: 10,
    marginHorizontal: 5,
  },
  contentContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkImage: {
    width: 20,
    height: 20,
  },
  pickerStyle: {
    maxWidth: "100%",
    minWidth: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",

    borderWidth: 1,
    backgroundColor: "#8000008d",
    borderColor: "black",
    borderRadius: 9,
    overflow: "hidden",
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontWeight: "bold",
    color: "black",
  },
  pickerLabelStyle: {
    color: "white",
    fontWeight: "bold",
    overflow: "hidden",
  },
  flatlistView: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  chevronImage: {
    width: 20,
    height: 20,
  },
  emptyList: {
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#8000008d",
    borderColor: "black",
    borderRadius: 12,
    overflow: "hidden",
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: "black",
  },
});

const nullable =
  (propType) =>
  (props, propName, ...rest) =>
    props[propName] === null ? null : propType(props, propName, ...rest);

DropDownPicker.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  selectedPlayer: nullable(PropTypes.string.isRequired),
  setSelectedPlayer: PropTypes.func.isRequired,
  emptyListLabel: PropTypes.string.isRequired,
  openDirection: PropTypes.string,
  onOpenTrigger: PropTypes.func,
};

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SizedText from "../SizedText";
import { timeDifference, secondsToHHMMSS } from "../../utils/dateFunctions";

export default function GameHeader({ switchTime, isDay }) {
  const [gameId, setGameId] = useState(0);
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(timeDifference(switchTime));

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, [switchTime]);

  useEffect(() => {
    AsyncStorage.getItem("idGame").then((idGame) => {
      setGameId(idGame);
    });
  }, []);

  return (
    <View style={styles.container}>
      <SizedText
        label={`Partie n˚${gameId}`}
        size="large"
        textStyle={styles.title}
      />

      <View>
        <Image
          style={styles.gameTimeIcon}
          source={
            isDay
              ? require("../../assets/images/sun.png")
              : require("../../assets/images/moon.png")
          }
          resizeMethod="scale"
          resizeMode="contain"
        />
      </View>

      <View style={styles.timeContainer}>
        <SizedText
          label={`${secondsToHHMMSS(time)}`}
          size="normal"
          textStyle={styles.title}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 40,
    backgroundColor: "#59647e",
    justifyContent: "center",
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    color: "#ffffff",
  },
  gameTimeIcon: {
    height: 30,
    width: 30,
    marginLeft: 15,
  },
  timeContainer: {
    width: 100,
    alignItems: "center",
  },
});

GameHeader.propTypes = {
  switchTime: PropTypes.number.isRequired,
  isDay: PropTypes.bool.isRequired,
};

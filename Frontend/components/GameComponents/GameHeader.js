import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Image } from "react-native";
import SizedText from "../SizedText";
import { timeDifference, secondsToHHMMSS } from "../../utils/dateFunctions";
import GameContext from "./GameContext";

export default function GameHeader() {
  const gameInfos = useContext(GameContext);
  const [time, setTime] = useState(Math.floor(gameInfos.switchTime / 1000));

  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 0;
        }
      });
    }, 1000);
  };

  const restartTimer = () => {
    clearInterval(timerRef.current);
    setTime(gameInfos.switchTime / 1000);
    startTimer();
  };

  useEffect(() => {
    restartTimer(); // Reset the timer when isDay or switchTime changes
    
    return () => {
      clearInterval(timerRef.current);
    };
  }, [gameInfos.isDay]); // Add isDay and switchTime as dependencies

  return (
    <View style={styles.container}>
      <SizedText
        label={`Partie n˚${gameInfos.infos.idGame}`}
        size="large"
        textStyle={styles.title}
      />

      <View>
        <Image
          style={styles.gameTimeIcon}
          source={
            gameInfos.isDay
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

// GameHeader.propTypes = {
//   switchTime: PropTypes.number.isRequired,
//   isDay: PropTypes.bool.isRequired,
// };

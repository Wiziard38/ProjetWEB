import { React, useState, useEffect } from "react";
import { StyleSheet, View, Platform, Pressable } from "react-native";
import SizedText from "../SizedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import PropTypes from "prop-types";

export default function TimeChoose({ mode, dureePeriode, setDureePeriode }) {
  const [TextDureePeriode, setTextDureePeriode] = useState("heures:minutes");
  const isAndroid = Platform.OS === "android";
  const [androidShow, setAndroidShow] = useState(false);

  useEffect(() => {
    let textTime;
    if (mode === "time") {
      textTime =
        dureePeriode.getHours() + "h" + dureePeriode.getMinutes() + "min";
    } else {
      textTime =
        dureePeriode.getDate() +
        "/" +
        (dureePeriode.getMonth() + 1) +
        "/" +
        dureePeriode.getFullYear();
    }

    setTextDureePeriode(textTime);
  }, [dureePeriode]);

  function onPress() {
    setAndroidShow(true);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <SizedText
          label={TextDureePeriode}
          size={"normal"}
          textStyle={styles.dateContainer}
        />
      </Pressable>

      <View style={styles.invisiblePick}>
        {(!isAndroid || androidShow) && (
          <DateTimePicker
            value={dureePeriode}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={(_, selectedDate) => {
              setDureePeriode(selectedDate);
              setAndroidShow(false);
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: "column",
    // alignItems: "left",
  },
  invisiblePick: {
    opacity: 0.1,
    position: "absolute",
    right: 0,
    top: 0,
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: "#2e6b8139",
    backgroundColor: "#62bada3a",
    textAlign: "center",
    padding: 5,
  },
});

TimeChoose.propTypes = {
  mode: PropTypes.string.isRequired,
  dureePeriode: PropTypes.object.isRequired,
  setDureePeriode: PropTypes.func.isRequired,
};

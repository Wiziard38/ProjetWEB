import { React, useState, useEffect } from "react";
import { StyleSheet, View, Platform, Pressable } from "react-native";
import SizedText from "../SizedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import PropTypes from "prop-types";
import { dateToText, timeToText } from "../../utils/dateFunctions";

export default function TimeChoose({
  mode,
  minDate,
  dureePeriode,
  setDureePeriode,
}) {
  const [TextDureePeriode, setTextDureePeriode] = useState("heures:minutes");
  const [androidShow, setAndroidShow] = useState(false);
  const isAndroid = Platform.OS === "android";

  useEffect(() => {
    let textTime;
    if (mode === "time") {
      textTime = timeToText(dureePeriode);
    } else {
      textTime = dateToText(dureePeriode);
    }

    setTextDureePeriode(textTime);
  }, [dureePeriode]);

  function onPress() {
    setAndroidShow(true);
  }

  const minimumDate = new Date();
  minimumDate.setHours(minimumDate.getHours() + 1);

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
            minimumDate={minDate ? minimumDate : null}
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
    opacity: 0,
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
  minDate: PropTypes.bool.isRequired,
  dureePeriode: PropTypes.object.isRequired,
  setDureePeriode: PropTypes.func.isRequired,
};

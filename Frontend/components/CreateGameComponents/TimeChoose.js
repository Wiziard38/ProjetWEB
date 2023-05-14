import { React, useState, useEffect } from "react";
import { StyleSheet, View, Platform, Pressable } from "react-native";
import { createElement } from "react-native-web";
import SizedText from "../SizedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import PropTypes from "prop-types";
import {
  dateToText,
  dateToTextWeb,
  timeToText,
  timeToTextWeb,
} from "../../utils/dateFunctions";

export default function TimeChoose({
  mode,
  minDate,
  dureePeriode,
  setDureePeriode,
}) {
  const [TextDureePeriode, setTextDureePeriode] = useState("heures:minutes");
  const [androidShow, setAndroidShow] = useState(false);
  const isAndroid = Platform.OS === "android";
  const isWeb = Platform.OS === "web";
  const minimumDate = new Date();
  minimumDate.setHours(minimumDate.getHours() + 1);

  useEffect(() => {
    let textTime;

    if (isWeb) {
      if (mode === "time") {
        textTime = timeToTextWeb(dureePeriode);
      } else {
        textTime = dateToTextWeb(dureePeriode);
      }
    } else {
      if (mode === "time") {
        textTime = timeToText(dureePeriode);
      } else {
        textTime = dateToText(dureePeriode);
      }
    }
    console.log(textTime);

    setTextDureePeriode(textTime);
  }, [dureePeriode]);

  function onPress() {
    setAndroidShow(true);
  }

  if (isWeb) {
    return createElement("input", {
      type: mode,
      value: TextDureePeriode,
      onInput: (event) => {
        const selectedTime = event.target.value;
        if (mode === "time") {
          const [hours, minutes] = selectedTime.split(":");
          const newDate = new Date(dureePeriode);
          newDate.setHours(parseInt(hours));
          newDate.setMinutes(parseInt(minutes));

          setDureePeriode(newDate);
        } else {
          console.log(selectedTime);
          const [year, month, day] = selectedTime.split("-");
          const newDate = new Date(dureePeriode);
          newDate.setFullYear(parseInt(year));
          newDate.setMonth(parseInt(month));
          newDate.setDate(parseInt(day));

          setDureePeriode(newDate);
        }
      },
    });
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

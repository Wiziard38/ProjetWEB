import { React, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SizedText from "../SizedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import PropTypes from "prop-types";

export default function TimeChoose({ titleLabel, dureePeriode, setDureePeriode }) {
  const [TextDureePeriode, setTextDureePeriode] = useState("heures:minutes");

  useEffect(() => {
    const fTime = dureePeriode.getHours() + "h" + dureePeriode.getMinutes() + "min";
    setTextDureePeriode(fTime);
  }, [dureePeriode]);

  return (
    <View style={styles.container}>
      <SizedText
        label={titleLabel}
        size="large"
        textStyle={{ fontWeight: "bold" }}
      />

      <SizedText
        label={TextDureePeriode}
        size={"normal"}
        textStyle={styles.dateContainer}
      />

      <View
        style={{ opacity: 0, position: "absolute", bottom: 15, right: "40%" }}
      >
        <DateTimePicker
          testID="dateTimePicker"
          value={dureePeriode}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={(_, selectedDate) => {
            setDureePeriode(selectedDate);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: "#2e6b8139",
    backgroundColor: "#62bada3a",
    textAlign: "center",
    padding: 5,
    margin: 5,
  },
});

TimeChoose.propTypes = {
  titleLabel: PropTypes.string.isRequired,
  dureeJour: PropTypes.object.isRequired,
  setDureeJour: PropTypes.func.isRequired,
};

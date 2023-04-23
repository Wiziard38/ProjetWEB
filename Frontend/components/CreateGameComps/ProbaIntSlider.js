import React from "react";
import { View } from "react-native";
import Slider from "@react-native-community/slider";
import SizedText from "../SizedText";
import PropTypes from "prop-types";

export default function ProbaIntSlider({ proba, setProba, labelProba }) {

  const numFactor = 10000;

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <SizedText
        label={labelProba}
        size="large"
        textStyle={{ fontWeight: "bold", textAlign: "center" }}
      />
      <SizedText
        label={proba}
        size="large"
        textStyle={{ fontWeight: "bold", textAlign: "center" }}
      />

      <Slider
        style={{ width: "100%", height: 10 }}
        minimumValue={0}
        maximumValue={numFactor}
        step={1}
        minimumTrackTintColor="rgb(255,0,0)"
        maximumTrackTintColor="rgb(0,0,255)"
        value={parseFloat(proba) * numFactor}
        onValueChange={(value) => {
          clearTimeout(this.sliderTimeoutId);
          this.sliderTimeoutId = setTimeout(() => {
            setProba((value / numFactor).toString());
          }, 5);
        }}
      />
    </View>
  );
}

ProbaIntSlider.propTypes = {
  proba: PropTypes.string.isRequired,
  setProba: PropTypes.func.isRequired,
  labelProba: PropTypes.string.isRequired,
};

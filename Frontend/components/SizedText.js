import React from "react";
import { View, Text, Dimensions } from "react-native";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

export default function SizedText({ label, size, textStyle }) {
  let textSize;

  // Set textSize based on size prop
  if (size === "mini") {
    textSize = width < 400 ? width / 30 : width / 44;
  } else if (size === "small") {
    textSize = width < 400 ? width / 26 : width / 40;
  } else if (size === "normal") {
    textSize = width < 400 ? width / 24 : width / 36;
  } else if (size === "large") {
    textSize = width < 400 ? width / 20 : width / 32;
  } else if (size === "xlarge") {
    textSize = width < 400 ? width / 16 : width / 28;
  } else if (size === "xxlarge") {
    textSize = width < 400 ? width / 14 : width / 24;
  }

  return (
    <View>
      <Text style={[textStyle, { fontSize: textSize }]}>{label}</Text>
    </View>
  );
}

SizedText.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf([
    "mini",
    "small",
    "normal",
    "large",
    "xlarge",
    "xxlarge",
  ]).isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

import React from "react";
import { View, Pressable } from "react-native";
import SizedText from "./SizedText";
import PropTypes from "prop-types";

export default function SizedButton({
  buttonLabel,
  onPress,
  size,
  buttonStyle,
  buttonLabelStyle,
}) {
  return (
    <View>
      <Pressable style={[buttonStyle]} onPress={() => onPress()}>
        <SizedText
          label={buttonLabel}
          size={size}
          textStyle={[buttonLabelStyle, { overflow: "hidden" }]}
        />
      </Pressable>
    </View>
  );
}

SizedButton.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.oneOf([
    "mini",
    "small",
    "normal",
    "large",
    "xlarge",
    "xxlarge",
  ]).isRequired,
  buttonStyle: PropTypes.object,
  buttonLabelStyle: PropTypes.object,
};

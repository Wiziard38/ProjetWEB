import { View, Pressable } from "react-native";
import Sizedtext from "./SizedText";

export default function SizedButton({
  buttonLabel,
  onPress,
  size,
  buttonStyle,
  buttonLabelStyle,
}) {
  return (
    <View>
      <Pressable style={buttonStyle} onPress={() => onPress()}>
        <Sizedtext
          label={buttonLabel}
          size={size}
          textStyle={buttonLabelStyle}
        />
      </Pressable>
    </View>
  );
}

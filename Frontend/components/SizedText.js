import { View, Text, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function SizedText({ label, size, textStyle }) {
  let textSize;

  // Set textSize based on size prop
  if (size === "mini") {
    textSize = width / 30;
  } else if (size === "small") {
    textSize = width / 26;
  } else if (size === "normal") {
    textSize = width / 24;
  } else if (size === "large") {
    textSize = width / 20;
  } else if (size === "xlarge") {
    textSize = width / 16;
  }

  return (
    <View>
      <Text style={[textStyle, { fontSize: textSize }]}>{label}</Text>
    </View>
  );
}

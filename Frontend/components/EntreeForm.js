import React from "react";
import { View, Text, TextInput } from "react-native";
import PropTypes from "prop-types";

export default function EntreeForm({
  label,
  onChange,
  keyboardType,
  style,
  dataName,
}) {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Text>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChange}
        placeholder={dataName}
        style={style}
      />
    </View>
  );
}

EntreeForm.propTypes = {
  label: PropTypes.string, // isRequired ?
  onChange: PropTypes.func.isRequired,
  keyboardType: PropTypes.string, // isRequired ?
  style: PropTypes.object,
  dataName: PropTypes.string,
};

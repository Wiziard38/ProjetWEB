import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import DropDownPicker from "react-native-dropdown-picker";

export default function PlayerScrollList({
  listPlayers,
  selectedPlayer,
  setSelectedPlayer,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={selectedPlayer}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedPlayer}
        setItems={setItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

PlayerScrollList.propTypes = {
  listPlayers: PropTypes.array.isRequired,
  selectedPlayer: PropTypes.string.isRequired,
  setSelectedPlayer: PropTypes.func.isRequired,
};

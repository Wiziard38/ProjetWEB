import { StyleSheet, View, Pressable, Text } from 'react-native';

export default function MonBouton({ label, onPress }) {
  return (
    <View>
      <Pressable onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonLabel: {
    color: "white",
    backgroundColor: "black",
    borderRadius:10,
    padding: 10,
    borderWidth: 2,
    borderColor: "red",
  }
});
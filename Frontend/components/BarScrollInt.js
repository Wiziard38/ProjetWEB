import React, { useState } from "react";
import { View, Text, Dimensions, Pressable, StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";
const width = parseInt(Dimensions.get("window").width);

export default function BarScrollInt({ onPress, title }) {
  const [valeur, setValeur] = useState(5);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.titleStyle}>{title}</Text>
      <View style={styles.view}>
        <Pressable onPress={() => { setValeur(valeur - 1); onPress((valeur - 1).toString()); console.log(width) }}>
          <Image
            source={require("../static/images/flèche-gauche.png")}
            resizeMethod="scale"
            resizeMode="center"
          />
        </Pressable>
        <View style = {styles.header}>
          <Pressable style = {styles.items}  onPress={() => { setValeur(valeur - 3); onPress((valeur - 3).toString()) }}>
            <Text style={styles.textStyle}>{valeur - 3}</Text>
          </Pressable>
          <Pressable style = {styles.items} onPress={() => { setValeur(valeur - 2); onPress((valeur - 2).toString()) }}>
            <Text style={styles.textStyle}>{valeur - 2}</Text>
          </Pressable>
          <Pressable style = {styles.items} onPress={() => { setValeur(valeur - 1); onPress((valeur - 1).toString()) }}>
            <Text style={styles.textStyle}>{valeur - 1}</Text>
          </Pressable>
          <Pressable style = {styles.items} onPress={() => { setValeur(valeur); onPress((valeur).toString()) }}>
            <Text style={styles.textStyleCenter}>{valeur}</Text>
          </Pressable>
          <Pressable style = {styles.items} onPress={() => { setValeur(valeur + 1); onPress((valeur + 1).toString()) }}>
            <Text style={styles.textStyle}>{valeur + 1}</Text>
          </Pressable>
          <Pressable style = {styles.items} onPress={() => { setValeur(valeur + 2); onPress((valeur + 2).toString()) }}>
            <Text style={styles.textStyle}>{valeur + 2}</Text>
          </Pressable>
          <Pressable style = {styles.items} onPress={() => { setValeur(valeur + 3); onPress((valeur + 3).toString()) }}>
            <Text style={styles.textStyle}>{valeur + 3}</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => { setValeur(valeur + 1); onPress((valeur + 4).toString()) }}>
          <Image
            source={require("../static/images/flèche-droite.png")}
            resizeMethod="scale"
            resizeMode="center"
          />
        </Pressable>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    fontFamily: 'Roboto',
    color: "black",
    fontWeight: "bold"
  },
  view: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(0, 0, 0)',
    borderRadius: 25,
    margin: 2

  },
  items: {
  },
  header: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: "100%"
  },
  textStyle: {
    color: "white",
    padding: 5,
    fontSize: 30,
    fontFamily: 'Roboto'
  },
  textStyleCenter: {
    color: "white",
    padding: 5,
    fontSize: 30,
    fontFamily: 'Roboto',
    borderRadius: 25,
    backgroundColor: "grey"

  }
});


BarScrollInt.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

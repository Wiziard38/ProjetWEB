import React, { useState } from "react";
import { View, Dimensions, Pressable, StyleSheet, Image } from "react-native";
import SizedText from "../SizedText";
import PropTypes from "prop-types";
import flecheGauche from "../../static/images/fleche-gauche.png";
import flecheDroite from "../../static/images/fleche-droite.png";

const windowWidth = Dimensions.get("window").width;

export default function BarScrollInt({ onPress, title }) {
  const [valeur, setValeur] = useState(5);
  const minValue = 5;

  const Item = ({ offset, valeur }) => {
    const newValue = valeur + offset;
    const itemWidth = windowWidth * 0.1;

    return (
      <Pressable
        style={[
          { width: itemWidth },
          styles.itemStyle,
          offset === 0 && { backgroundColor: "grey", borderRadius: 10 },
        ]}
        onPress={() => {
          if (newValue >= minValue) {
            setValeur(newValue);
            onPress(newValue.toString());
          }
        }}
      >
        <SizedText
          label={newValue.toString()}
          size={offset === 0 ? "xlarge" : "large"}
          textStyle={[
            styles.numberStyle,
            newValue < minValue && { opacity: 0.5 },
          ]}
        />
      </Pressable>
    );
  };

  const Arrow = ({ offset, valeur, left }) => {
    const imageSource = left ? flecheGauche : flecheDroite;
    const newValue = valeur + offset;

    return (
      <Pressable
        onPress={() => {
          if (newValue >= minValue) {
            setValeur(newValue);
            onPress(newValue.toString());
          }
        }}
      >
        <Image source={imageSource} resizeMethod="scale" resizeMode="center" />
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <SizedText label={title} size={"large"} textStyle={styles.titleStyle} />

      <View style={styles.sliderStyle}>
        <Arrow offset={-1} valeur={valeur} left={true} />

        <View style={styles.header}>
          <Item offset={-3} valeur={valeur} />
          <Item offset={-2} valeur={valeur} />
          <Item offset={-1} valeur={valeur} />
          <Item offset={0} valeur={valeur} />
          <Item offset={+1} valeur={valeur} />
          <Item offset={+2} valeur={valeur} />
          <Item offset={+3} valeur={valeur} />
        </View>

        <Arrow offset={+1} valeur={valeur} left={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "black",
    fontWeight: "bold",
  },
  sliderStyle: {
    flex: 0.6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0)",
    borderRadius: 25,
    margin: 2,
  },
  itemStyle: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: "100%",
  },
  numberStyle: {
    color: "white",
    padding: 5,
  },
});

BarScrollInt.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

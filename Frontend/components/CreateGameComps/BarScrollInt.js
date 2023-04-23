import React from "react";
import { View, Dimensions, Pressable, StyleSheet, Image } from "react-native";
import SizedText from "../SizedText";
import PropTypes from "prop-types";
import flecheDroite from "../../assets/images/fleche-droite.png";
import flecheGauche from "../../assets/images/fleche-gauche.png";

const windowWidth = Dimensions.get("window").width;

export default function BarScrollInt({ nbJoueur, setNbJoueur, title }) {
  const minValue = 5;

  const Item = ({ offset }) => {
    const newValue = nbJoueur + offset;
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
            setNbJoueur(newValue);
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

  Item.propTypes = {
    offset: PropTypes.number.isRequired,
  };
  
  const Arrow = ({ offset, left }) => {
    const imageSource = left ? flecheGauche : flecheDroite;
    const newValue = nbJoueur + offset;

    return (
      <Pressable
        onPress={() => {
          if (newValue >= minValue) {
            setNbJoueur(newValue);
          }
        }}
      >
        <Image source={imageSource} resizeMethod="scale" resizeMode="center" />
      </Pressable>
    );
  };

  Arrow.propTypes = {
    offset: PropTypes.number.isRequired,
    left: PropTypes.bool.isRequired,
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <SizedText label={title} size={"large"} textStyle={styles.titleStyle} />

      <View style={styles.sliderStyle}>
        <Arrow offset={-1} left={true} />

        <View style={styles.header}>
          <Item offset={-3} />
          <Item offset={-2} />
          <Item offset={-1} />
          <Item offset={0} />
          <Item offset={+1} />
          <Item offset={+2} />
          <Item offset={+3} />
        </View>

        <Arrow offset={+1} left={false} />
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
  nbJoueur: PropTypes.number.isRequired,
  setNbJoueur: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

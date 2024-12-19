import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const img = require("../assets/taxi-ufo-middle.gif");

const Loader = () => {
  return (
    <View style={styles.screen}>
      <Image source={img} style={styles.image} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
});

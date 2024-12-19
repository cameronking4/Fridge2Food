import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const CategoryCard = ({ data }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: data.strCategoryThumb }} style={styles.image} />
      <Text style={styles.text}>{data.strCategory}</Text>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    elevation: 5,
    marginVertical: 12,
    marginHorizontal: 8,
  },
  image: {
    height: 80,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  text: {
    fontWeight: "400",
    color: "#724502",
  },
});

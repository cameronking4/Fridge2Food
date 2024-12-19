import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Loader from "../Components/Loader";

const CategoryScreen = ({ route }) => {
  const [categoryName, setCategoryName] = useState(
    route.params.category.strCategory
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
      );
      const data = await res.json();
      console.log(data);
      setData(data.meals);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching the meals: ", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => {
        console.log(item.strMeal);
        navigation.navigate("MealDetails", {
          mealID: item.idMeal,
          image: item.strMealThumb,
        });
      }}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
    </Pressable>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{categoryName}</Text>
      <View style={styles.list}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          style={styles.flatList}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 42,
    fontWeight: "bold",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  item: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: "hidden",
    aspectRatio: 0.75,
  },
  image: {
    height: 200,
    borderRadius: 8,
  },
  text: {
    padding: 8,
    backgroundColor: "#EEAF0E",
    textAlign: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  list: {
    marginBottom: 100,
    paddingTop: 0,
  },
  loading: {
    textAlign: "center",
    marginTop: 64,
    fontSize: 18,
    fontWeight: "400",
  },
  flatList: {
    marginBottom: 80,
    padding: 16,
  },
});

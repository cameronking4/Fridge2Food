import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import CategoryCard from "../Components/CategoryCard";
import Loader from "../Components/Loader";

const img = require("../assets/taxi-gears.gif");

const Collections = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [randomLoading, setRandomLoading] = useState(true);
  const [randomMeal, setRandomMeal] = useState([]);

  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const cameraRef = useRef(null); // Adding cameraRef here
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      console.clear();
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await res.json();
      setCategoriesData(data.categories);
      setCategoriesLoading(false);
    } catch (err) {
      console.error("Error fetching meal categories: ", err);
    }
  };

  const fetchRandomMeal = async () => {
    try {
      setLoading(true);
      setRandomLoading(true);
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await res.json();
      setRandomMeal(data.meals);
      setRandomLoading(false);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching random meal: ", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRandomMeal();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRandomMeal();
    }, [])
  );

  const handlePressSearch = () => {
    navigation.navigate("Search");
  };

  if (categoriesLoading && randomLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.screen}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>
            Find <Text style={styles.titleYellow}>best recipes </Text>
          </Text>
          <Text style={styles.title}>for cooking </Text>
          <Pressable style={styles.searchBox} onPress={handlePressSearch}>
            <Ionicons name="search" size={24} color={"#EEAF0E"} />
            <Text style={styles.input}>Search</Text>
          </Pressable>
        </View>

        <Text style={styles.subheading}>Popular Categories</Text>
        <ScrollView horizontal style={styles.categoriesList}>
          {categoriesData?.map((category, index) => (
            <Pressable
              key={index}
              onPress={() => {
                navigation.navigate("CategoryScreen", { category });
              }}
            >
              <CategoryCard data={category} />
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.subheading}>Meal of the Day</Text>
        <View>
          {randomMeal?.map((meal, index) => (
            <Pressable
              key={index}
              style={styles.randomMeal}
              onPress={() => {
                navigation.navigate("MealDetails", {
                  mealID: meal.idMeal,
                  image: meal.strMealThumb,
                });
              }}
            >
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <Image
                    source={img}
                    style={{
                      width: 200,
                      height: 100,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: meal.strMealThumb }}
                    style={styles.randomImage}
                  />
                  <Text style={styles.randomText}>{meal.strMeal}</Text>
                </>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Collections;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    resizeMode: "cover",
  },
  lottie: {
    width: 100,
    height: 100,
  },
  titleBox: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600",
    paddingLeft: 24,
  },
  titleYellow: {
    color: "#EEAF0E",
  },
  camera:{
    margin: 24,
    height: 300
  },
  searchBox: {
    flexDirection: "row",
    borderColor: "#EEAF0E",
    borderWidth: 1,
    padding: 12,
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 2,
    marginLeft: 8,
  },
  categoriesList: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loading: {
    textAlign: "center",
    marginTop: 64,
    fontSize: 18,
    fontWeight: "400",
  },
  randomMeal: {
    margin: 24,
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: "white",
    overflow: "hidden",
    marginBottom: 24,
    elevation: 3,
  },
  randomImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  randomText: {
    padding: 5,
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "white",
    color: "#724502",
  },
});

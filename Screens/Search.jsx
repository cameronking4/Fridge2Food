import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-deck-swiper";


const load = require("../assets/taxi-gears.gif");
const empty = require("../assets/taxi-29.gif");

const Search = () => {
  const [name, setName] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const focusTextInput = () => {
        if (inputRef.current && name === "") {
          inputRef.current.focus();
        }
      };

      focusTextInput();
    }, [])
  );

  const handleSubmit = async () => {
    setLoading(true);
    // console.log(name + ":");
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
      );
      const data = await res.json();
      setMeals(data.meals);
      console.log(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={24} color={"#EEAF0E"} />
        <TextInput
          ref={inputRef}
          placeholder="Search"
          style={styles.input}
          onSubmitEditing={handleSubmit}
          onChangeText={(text) => {
            setName(text);
          }}
        />
      </View>
      <>
        {loading ? (
          <View style={styles.loadingScreen}>
            <Image source={load} style={styles.loadingImage} />
          </View>
        ) : (
          <>
            {name == "" ? (
              <View style={styles.loadingScreen}>
                <Text>Nothing yet</Text>
                <Image source={empty} style={styles.loadingImage} />
              </View>
            ) : (
              <ScrollView style={styles.resultBox}>
                {meals == null ? (
                  <View style={styles.loadingScreen}>
                    <Text>Invalid Input</Text>
                    <Image source={empty} style={styles.loadingImage} />
                  </View>
                ) : (
                  <>
                    {meals.map((meal, i) => (
                      <Pressable
                        key={i}
                        style={styles.card}
                        onPress={() => {
                          navigation.navigate("MealDetails", {
                            mealID: meal?.idMeal,
                            image: meal?.strMealThumb,
                          });
                        }}
                      >
                        <Image
                          source={{ uri: meal.strMealThumb }}
                          style={styles.image}
                        />
                        <Text style={styles.cardText}>{meal.strMeal}</Text>
                      </Pressable>
                    ))}
                    <View style={styles.blank}></View>
                  </>
                )}
                <View style={styles.blank}></View>
              </ScrollView>
            )}
          </>
        )}
      </>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '500',
    height:"600",
    backgroundColor: "#F5FCFF"
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    width: '500',
    height:'500',
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  },

  screen: {
    flex: 1,
    padding: 24,
    paddingTop: 12,
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
  resultBox: {
    marginTop: 24,
  },
  image: {
    width: "100%",
    aspectRatio: 0.75,
  },
  loadingImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blank: {
    height: 48,
  },
  image: {
    width: "100%",
    height: 200,
  },
  card: {
    marginVertical: 12,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardText: {
    padding: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#724502",
  },
});

import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import axios from "axios";

const img = require("../assets/taxi-gears.gif");

const MealDetails = ({ route }) => {
  const [title, setTitle] = useState(route.params.title);
  const [instructions, setInstructions] = useState(route.params.instructions);
  const [ingredients, setIngredients] = useState(route.params.ingredients);
  const [loading, setLoading] = useState(false);
  const [bookmark, setBookmark] = useState(route.params.bookmark);
  const [imageUrl, setImageUrl] = useState('');

  console.log("route:", route);
  
  const fetchImageFromUnsplash = async (searchTerm) => {
      try {
        const response = await axios.get("https://api.unsplash.com/search/photos", {
          headers: {
            Authorization: "Client-ID -INSERT_KEY_HERE",
          },
          params: {
            query: searchTerm,
            per_page: 3, 
          },
        });
        console.log(response.data.results[0].urls.regular);
        if (response.data.results[0].urls.regular) {
          console.log(response.data.results[0].urls.regular);
          setImageUrl(response.data.results[2].urls.regular);
          return response.data.results[0].urls.regular;
        }
      } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
      }
    };
    useEffect(() => {
      fetchImageFromUnsplash(title); // Fetch image when card is rendered
    }, [title]);

  // const handleYoutube = (url) => {
  //   Linking.openURL(url).catch((err) =>
  //     console.error("Error opening youtube url: ", err.message)
  //   );
  // };

  const handleBookmark = async () => {
    setBookmark(!bookmark);
    if (!loading) {
      try {
        const user = auth.currentUser;
        const userId = user.uid;

        const recipeRef = doc(
          db,
          "bookmarks",
          userId,
          "recipes",
          route.params.mealID
        );
        const recipeSnapshot = await getDoc(recipeRef);

        if (recipeSnapshot.exists()) {
          await deleteDoc(recipeRef);
          setBookmark(false);
        } else {
          await setDoc(recipeRef, {
            image: route.params.image,
            name: meal?.strMeal,
          });
          setBookmark(true);
        }

        // setBookmark(!bookmark);
      } catch (error) {
        console.error("Error updating bookmarks:", error);
      }
    }
  };

  return (
    <View style={styles.screen}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Pressable style={styles.bookmark} onPress={handleBookmark}>
        {bookmark ? (
          <Ionicons name="bookmark" size={24} />
        ) : (
          <Ionicons name="bookmark-outline" size={24} />
        )}
      </Pressable>
      <ScrollView style={styles.details}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={img}
              style={{
                width: 200,
                height: 200,
                resizeMode: "contain",
                marginTop: 100,
              }}
            />
          </View>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            {/* <View style={styles.tags}>
              <Text style={styles.tagText}>{meal?.strCategory}</Text>
              <Text>•</Text>
              <Text style={styles.tagText}>{meal?.strArea}</Text>
              <Text>•</Text>
              <Text style={styles.tagText}>
                {meal.strTags ? meal.strTags : "No Tags"}
              </Text>
            </View> */}
            <View>
              <Text style={styles.subHeading}>Ingredients</Text>
              <View>
                <Text style={styles.instructions}>{ingredients}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.subHeading}>Instructions</Text>
              <Text style={styles.instructions}>{instructions}</Text>
            </View>
            {/* <Pressable
              style={styles.button}
              onPress={() => handleYoutube(meal.strYoutube)}
            >
              <Text style={styles.buttonText}>Watch video</Text>
            </Pressable> */}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MealDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bookmark: {
    position: "absolute",
    top: 50,
    right: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
  },
  image: {
    width: "100%",
    height: 300,
  },
  details: {
    backgroundColor: "white",
    padding: 24,
    marginTop: -30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 5,
  },
  title: {
    color: "#724502",
    fontWeight: "bold",
    fontSize: 32,
  },
  tags: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  tagText: {
    fontWeight: "300",
  },
  subHeading: {
    fontWeight: "600",
    fontSize: 24,
    marginTop: 24,
    color: "#724502",
  },
  ingredientsList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  instructions: {
    marginTop: 8,
    fontSize: 20,
  },
  button: {
    backgroundColor: "#eeaf0e",
    padding: 12,
    marginBottom: 48,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
});

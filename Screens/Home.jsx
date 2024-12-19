import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Vibration
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import Swiper from 'react-native-deck-swiper';
import axios from "axios";
import { Modal } from 'react-native';
import { Dimensions } from "react-native";
const img = require("../assets/taxi-gears.gif");
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import * as StoreReview from 'expo-store-review';

const Home = () => {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [swipedAll, setSwipedAll] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const navigation = useNavigation();
  const [isSwiperVisible, setIsSwiperVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const cameraRef = useRef(null); // Adding cameraRef here

  const OAI_APIKEY = "sk-proj-XXXXXXXXXXXXX";

  const getPreferences = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists() && userDoc.data().user_preferences !== preferences) {
        // User document exists
        const userData = userDoc.data();
        // console.log("Document data:", userData);
        setPreferences(userData.user_preferences);
        return userData.user_preferences;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user preferences: ", error);
    }
  }
  

  const upload = async (base64_imgs, foodPref) => {
    const messages = base64_imgs.map(img => ({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: img,
            },
          },
        ],
    }));

    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a fridge2food recipe assistant. 
            You receive images of the inside of refrigerators and pantries and identify the foods and products to return at least 12 amazing recipes that can be prepared immediately or with little grocery shopping needed. 
            Assume meals are for two people. Include exact quantities in your ingredients list and adapt to user preferences given.
            Filter you recipes based on the user's preferences: ${foodPref}`,
          },
          ...messages,   
          {
            role: "user",
            content: 
            `Your response must simple be the JSON array. Mock your response as an arry of recipes [recipe1, recipe2, recipe3, ...] where each recipe is an object with the following properties: title, ingredients, instructions.
            It is your job to structue your response after generating recipes and never preface your response with backticks, additional strings or explain even the syntax - return the final array. 
            Ensure your response is only the array of objects for recipes.  For example:
            [
              {
                "title: "Vegetable Stir-fry",
                "ingredients": "Fresh vegetables (2 cups, any variety), Soy sauce (2 tablespoons)",
                "instructions": "1. Chop the vegetables into bite-sized pieces. 2. Heat a pan over medium heat, add the vegetables, and stir-fry for 5-7 minutes. 3. Add the soy sauce and stir well to combine. 4. Serve hot."
              },
              {
                "title": "Tomato and Cheese Quesadillas",
                "ingredients": "Tortillas (2), Tomatoes (1 medium), Cheese (1/2 cup, shredded)",
                "instructions": "1. Place a tortilla on a pan over medium heat. 2. Sprinkle half the cheese, diced tomatoes, and optional filling on top. 3. Cover with another tortilla. 4. Cook until the bottom tortilla is golden brown, then flip and cook the other side. 5. Cut into quarters and serve."
              },
              ...
            ]`
          }     
        ],
        max_tokens: 4000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OAI_APIKEY}`,
        },
      }
    );
    let msg = res.data.choices[0].message.content;
    console.log(preferences);
    // console.log(res.data);
    return msg;
};

const deduce = async (text) => {
  const messages = base64_imgs.map(img => ({
    role: "user",
    content: [
      {
        type: "image_url",
        image_url: {
          url: img,
        },
      },
    ],
}));

const res = await axios.post(
  "https://api.openai.com/v1/chat/completions",
  {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a fridge2food recipe assistant. You receive images of the inside of refrigerators and pantries and identify the foods and products to return at least 20 recipes that can be prepared immediately or with little grocery shopping needed.`,
      },
      ...messages,   
      {
        role: "user",
        content: "Summarize the ingredients available. Provide a bulletlist of foods/products and then a paragraph of summary for types of recipes possible. DO NOT INCLUDE BACKTICKS OR SYNTAX FORMAT NOTES IN YOUR RESPONSE."
      }     
    ],
    max_tokens: 4000,
  },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OAI_APIKEY}`,
    },
  }
);
let msg = res.data.choices[0].message.content;
console.log(res.data);
return msg;
};

const checkAndRequestPermission = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  setHasPermission(status === 'granted');
  if (status === 'denied') {
    Alert.alert(
      "Camera Permission Required",
      "This app needs camera access to function properly. Please grant camera access in your settings.",
      [
        { 
          text: "Go to Settings",
          onPress: () => 
            Platform.OS === 'ios'
              ? Linking.openURL('app-settings:')
              : Linking.openSettings()
        },
        { text: "Cancel", style: 'cancel' }
      ],
      { cancelable: false }
    );
  }
};

useEffect(() => {
  checkAndRequestPermission();
}, []);

if (hasPermission === false) {
  // Optionally, handle the case where permission is permanently denied
  return <Text>Camera access was denied. Please enable it in your settings.</Text>;
}

  // Function to handle image capture
  const handleCapture = async () => {
    if (cameraRef.current && capturedPhotos.length < 5) {
      Vibration.vibrate(100);
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedPhotos([...capturedPhotos, { uri: data.uri, base64: data.base64 }]);
    }
  };

  function convertArrayToString(array) {
    // Filter out the elements where 'value' is false
    if (!array) return;
    let filteredArray = array.filter(item => item.value);
    // Extract the 'label' from each object and join them with a comma
    return filteredArray.map(item => item.label).join(', ');
}

  const loadSwipeDeck = async (base64Images, foodPref) => {
    try{
      setLoading(true);
      const response = await upload(base64Images, foodPref);
      const parsedRecipes = JSON.parse(response);
      setRecipes(parsedRecipes);
      setIsSwiperVisible(true);
    }
    catch (error) {
      console.error("Error uploading images: ", error);
    }
    setLoading(false);
  }

  // Function to generate recipes
  const handleGenerateRecipes = async () => {
    Vibration.vibrate(1250);
    const diet = await getPreferences(auth.currentUser.uid);
    const foodPref = convertArrayToString(diet);
    console.log(foodPref);
    if (capturedPhotos.length > 0) {
      const base64Images = capturedPhotos.map(photo => `data:image/jpg;base64,${photo.base64}`);
      await loadSwipeDeck(base64Images, foodPref);
      console.log(auth.currentUser.uid);
      updateGeneratedRecipesCount(auth.currentUser.uid);
    }
  };

  const updateGeneratedRecipesCount = async (userId) => {
    try {// Replace with the current user's ID
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        // User document exists
        let newCount = 1; // Default value if field doesn't exist
        if (userDoc.data().generated_recipes_count) {
          newCount = userDoc.data().generated_recipes_count + 1;
        }
        await setDoc(userRef, { 
          generated_recipes_count: newCount,
          latest_at: new Date().toISOString(),
          // favorites: ,
         }, { merge: true });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating generated_recipes_count: ", error);
    }
  };

  // Function to remove the last captured photo
  const handleRemoveLastPhoto = () => {
    setCapturedPhotos(capturedPhotos.slice(0, -1));
  };

  // Cool loading
  if (loading) {
    const loader = StyleSheet.create({
      modal: {
        width: '100%',
        height: '100%'
      },
      screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      image: {
        width: "70%",
        height: "60%",
        resizeMode: "contain",
      }
    });
    const img = require("../assets/taxi-ufo-middle.gif");
    return(
    <View style={loader.screen}>
      <Image source={img} style={loader.image} />
      <Text>Generating recipes for ya...</Text>
      <Text>This can take up to three minutes, depending on ingredients detected.</Text>
    </View>
    );
  }
  // Render function for Swiper cards
  const renderCard = (card) => {
    const styles = StyleSheet.create({
      screen: {
        flex: 1,
        padding: 10,
      },
      bookmark: {
        position: "absolute",
        top: 50,
        right: 30,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 30,
      },
      text: {
        fontSize: 24
      },
      image: {
        width: "100%",
        height: 300,
      },
      details: {
        backgroundColor: "white",
        padding: 28,
        marginTop: 10,
        marginBottom: 24,
        borderRadius: 24,
        height: '100%',
        elevation: 8,
      },
      title: {
        color: "#724502",
        fontWeight: "bold",
        fontSize: 36,
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
        fontSize: 18,
        marginTop: 24,
        color: "#724502",
      },
      ingredientsList: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        fontSize: 24
      },
      instructions: {
        marginTop: 12,
        fontSize: 24
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
    
    return (
    <View style={styles.screen}>
      <ScrollView style={styles.details}>
      <Text style={styles.title}>{card.title}</Text>
      <View>
        <Text style={styles.subHeading}>Ingredients</Text>
        <View>
            <View style={styles.ingredientsList}>
            <Text style={styles.text}>{card.ingredients}</Text>
            </View>
        </View>
      </View>
      <View>
        <Text style={styles.subHeading}>Instructions</Text>
        <Text style={styles.text}>{card.instructions}</Text>
      </View>
    </ScrollView>
    </View>
    );
  };

  // Swiper component inside Modal
  const renderSwiper = () => {
    const { width } = Dimensions.get('window');
      const styles = StyleSheet.create({
        swiper: {
        flex: 1, // Take the full height available
        width: width - 55, // Responsive width minus padding
        alignSelf: 'center', // Center the swiper
        padding: 32,
      },
      container: {
        flex: 1,
        padding: 24,
        width: '500',
        height:"500",
        backgroundColor: "#F5FCFF"
      },
      card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        width: '500',
        height:'30%',
        borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 32
      },
      text: {
        textAlign: "center",
        fontSize: 50,
        backgroundColor: "transparent"
      }
      });

    return (
      <Modal
        style={styles.modal}
        animationType="slide"
        transparent={false}
        visible={isSwiperVisible}
        onRequestClose={() => setIsSwiperVisible(false)}
      >
        <Swiper
          cards={recipes}
          renderCard={renderCard}
          onSwiped={(cardIndex) => console.log(cardIndex)}
          onSwipedAll={() => {
            Vibration.vibrate(500);
            setSwipedAll(true);
            setIsSwiperVisible(false);
            startRate();
            setCapturedPhotos([]);
          }}
          onSwipedRight={saveToBookmarks}
          cardIndex={0}
          backgroundColor="gold"
          stackSize={3}
        />
      </Modal>
    );
  };

  const saveToBookmarks = async (cardIndex) => {
    Vibration.vibrate(100);
    let arr = favorites;
    arr.push(recipes[cardIndex]);
    setFavorites(arr);
    setDoc(doc(db, "users", auth.currentUser.uid), { favorites: arrayUnion(...arr) }, { merge: true });
  };

  const startRate = async () => {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview().then(() => setRated(true));
    }
    return true;
  };
  

  return (
    <SafeAreaView style={styles.screen}>
    {recipes && renderSwiper()}
     <ScrollView style={styles.screen}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>
            Take photos of inside your fridge and pantry <Text style={styles.titleYellow}>to generate recipes </Text>
          </Text>
        </View>
        <View>
          { hasPermission && <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.back}>
          <View style={styles.cameraInteractionContainer}>
            <Pressable style={styles.captureButton} onPress={handleCapture}>
              <Text style={styles.captureButtonText}>Capture</Text>
            </Pressable>
          </View>
          </Camera> }
          <Pressable 
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleGenerateRecipes}>
          <Text style={styles.buttonText}>Generate Recipes</Text>
        </Pressable>
        <View style={styles.capturedPhotosContainer}>
          <ScrollView horizontal>
            {capturedPhotos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo.uri }} style={styles.capturedPhoto} />
              </View>
            ))}
          </ScrollView>
          {capturedPhotos.length > 0 && (
            <Pressable style={styles.removeButton} onPress={handleRemoveLastPhoto}>
              <Ionicons name="trash" size={32} color="gray" />
            </Pressable>
          )}
        </View>
        </View>
        {/* <Text>{ideas}</Text> */}
        <View style={styles.container}>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

  swiper: {
    flex: 1, // Take the full height available
    width: 500, // Responsive width minus padding
    alignSelf: 'center', // Center the swiper
  },
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
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
    flex: 1, // Make sure the container takes up the full height
    backgroundColor: "white",
  },
  camera: {
    flex: 1, // Make the camera flexible in size
    margin: 24,
    minHeight: 500, // Maximum height for the camera component
  },
  cameraInteractionContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  capturedPhotosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    maxHeight: 200, // Limit the height of the photo container
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
  captureButton: {
    width: 70, // Diameter of the circle
    height: 70, // Diameter of the circle
    borderRadius: 35, // Half the width/height to make it a circle
    borderWidth: 2, // Thickness of the outline
    borderColor: 'white', // Color of the outline
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 14,
  },
  capturedPhoto: {
    height: 50,
    width: 50,
    resizeMode: "cover",
    margin: 5,
    marginBottom: 16
  },
  loading: {
    textAlign: "center",
    marginTop: 64,
    fontSize: 18,
    fontWeight: "400",
  },
  photoWrapper: {
    position: 'relative',
  },
  removeButton: {
    position: 'relative',
    marginRight: 0
  },
  button: {
    backgroundColor: "#EEAF0E",
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 54,
    marginBottom: 9,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign:"center",
    color: "black",
  },
});

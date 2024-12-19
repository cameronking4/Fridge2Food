import { StyleSheet, Text, View, Image, Switch, Vibration } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Pressable } from "react-native";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibraryAsync } from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const img = require("../assets/person.png");

const Profile = () => {
  const user = auth.currentUser;
  const userName = user.uid;
  const [userImage, setUserImage] = useState(null);
   // States for switches
   const [foodSensitivities, setFoodSensitivities] = useState([
    { label: "Cocktails only", value: false },
    { label: "Paleo only", value: false },
    { label: "Keto only", value: false },
    { label: "Vegan only", value: false },
    { label: "Vegetarian only", value: false },
    { label: "Lactose-Free", value: false },
    { label: "Nut-Free", value: false },
    { label: "Gluten-Free", value: false },
    { label: "Pescetarian ", value: false },
    // Add any other food sensitivities here
  ]);
  const handleSwitchChange = (index, newValue) => {
    const updatedSensitivities = [...foodSensitivities];
    updatedSensitivities[index].value = newValue;
    setFoodSensitivities(updatedSensitivities);
    setPreferences(userName);
  };
  
  const getPreferences = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // User document exists
        const userData = userDoc.data();
        // console.log("Document data:", userData);
        setFoodSensitivities(userData.user_preferences || [
          { label: "Cocktails only", value: false },
          { label: "Paleo only", value: false },
          { label: "Keto only", value: false },
          { label: "Vegan only", value: false },
          { label: "Vegetarian only", value: false },
          { label: "Lactose-Free", value: false },
          { label: "Nut-Free", value: false },
          { label: "Gluten-Free", value: false },
          { label: "Pescetarian ", value: false },
          // Add any other food sensitivities here
        ]);
        return userData.user_preferences;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user preferences: ", error);
    }
  }
  

  const setPreferences = async (userId) => {
    try {// Replace with the current user's ID
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        // User document exists
        await setDoc(userRef, { 
          user_preferences: foodSensitivities,
          latest_at: new Date().toISOString()
         }, { merge: true });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating generated_recipes_count: ", error);
    }
  };

  const navigation = useNavigation();

  const getProfile = async () => {
    try {
     getPreferences(userName);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("logged out");
        navigation.navigate("Onboarding");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEditImage = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      // console.log("Image Picker Result: ", result);

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        // console.log("Image URI: ", imageUri);

        const profileData = {
          id: auth.currentUser.email,
          image: imageUri,
        };
        AsyncStorage.setItem(
          auth.currentUser.email,
          JSON.stringify(profileData)
        );
        setUserImage(imageUri);

        console.log("Image uploaded and profile updated");
      } else {
        console.log("Image selection canceled");
      }
    } catch (err) {
      console.error("Error during image selection: ", err);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>uuid: {userName}</Text>
      <View style={styles.center}>
        <View style={styles.imageContainer}>
          <Image
            source={userImage ? { uri: userImage } : img}
            style={styles.image}
          />
        </View>
        <View style={styles.buttons}>
          {/* <Pressable style={styles.button} onPress={handleEditImage}>
            <Text style={styles.buttonText}>Edit Image</Text>
          </Pressable> */}
          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
        <View style={styles.foodSensitivityList}>
          {foodSensitivities.map((sensitivity, index) => (
            <View key={index} style={styles.foodSensitivityItem}>
              <Text style={styles.foodSensitivityLabel}>{sensitivity.label}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={sensitivity.value ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(newValue) => handleSwitchChange(index, newValue)}
                value={sensitivity.value}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingBottom: 0
  },
  subtitle: {
    fontSize: 10,
    color: "grey",
    fontWeight: "light",
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingTop: 2,
  },
  center: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  image: {
    width: 90,
    height: 90,
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 100,
    borderColor: "black",
    borderWidth: .3,
  },
  username: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 9,
    color: "#724502",
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 30,
  },
  button: {
    backgroundColor: "#e4e4e4",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    elevation: 2,
  },
  buttonText: {
    fontWeight: "500",
  },
  foodSensitivityList: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 40,
  },
  foodSensitivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  foodSensitivityLabel: {
    fontSize: 16,
    flex: 1,
  },
});

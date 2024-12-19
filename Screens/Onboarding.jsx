import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';

const Onboarding = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    signInAnonymously(auth)
    .then((userCredential) => {
      console.log("login success", userCredential.user.uid);
      // Create or update user in Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      setDoc(userDocRef, {
        uid: userCredential.user.uid,
        // other user details
      }, { merge: true }) // merge true to avoid overwriting existing fields
      console.log("User added/updated in Firestore");
      navigation.navigate("MainLayout");
    })
    .catch((err) => {
      alert("Login Failed", "Invalid email or password. Please try again.");
    });
  };

const img = require("../assets/bg2.jpg");

  const handlePress = () => {
    handleLoginPress();
    // navigation.navigate("Login");
  };

  return (
    <View style={styles.screen}>
      <ImageBackground source={img} style={styles.bg}>
        <Text style={styles.heading}>Fridge2Food</Text>
        <Text style={styles.para}>
          Scan your fridge & pantry and get instant recipes!
        </Text>

        <Pressable
          style={styles.button}
          activeOpacity={0.8}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Let's Go!</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: "red",
  },
  bg: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 24,
  },
  heading: {
    color: "white",
    fontSize: 42,
    fontWeight: "600",
  },
  para: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
  button: {
    backgroundColor: "#EEAF0E",
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 64,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
});

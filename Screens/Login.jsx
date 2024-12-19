import { StyleSheet, Text, TextInput, Pressable, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      console.log(auth.currentUser);

      if (auth.currentUser != null) {
        navigation.navigate("MainLayout");
      }
    }, [])
  );

  const handleLoginPress = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("login success");
        navigation.navigate("MainLayout");
      })
      .catch((err) => {
        // console.error("login error", err);
        alert("Login Failed", "Invalid email or password. Please try again.");
      });
  };

  const HandleSignupPress = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.screen}>
      {/* <StatusBar style="dark" /> */}
      <View style={styles.titleText}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.desc}>Please enter your account here</Text>
      </View>
      <View style={styles.inputs}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <View style={styles.goto}>
          <Text style={styles.gotoText}>Don't have any account?</Text>
          <Pressable onPress={HandleSignupPress}>
            <Text>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  desc: {
    fontSize: 18,
    fontWeight: "200",
    textAlign: "center",
  },
  inputs: {
    marginVertical: 32,
  },
  input: {
    color: "black",
    width: 300,
    marginVertical: 10,
    padding: 12,
    paddingLeft: 20,
    borderRadius: 32,
    borderColor: "#9FA5C0",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#EEAF0E",
    width: 300,
    padding: 12,
    borderRadius: 32,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  goto: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 12,
  },
  gotoText: {
    fontWeight: "200",
    paddingRight: 12,
  },
});

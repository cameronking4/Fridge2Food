import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import React, { useState } from "react";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useNavigation } from "@react-navigation/native";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");

  const navigation = useNavigation();

  const clear = () => {
    setEmail("");
    setPassword("");
    setRePassword("");
  };

  const register = () => {
    if (password == repassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("registered user: ", user);
          clear();
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      alert("Passwords does not match");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.titleText}>
        <Text style={styles.title}>Welcome!</Text>
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
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="re-enter password"
          value={repassword}
          onChangeText={(text) => setRePassword(text)}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>SignUp</Text>
        </Pressable>
        <View style={styles.goto}>
          <Text style={styles.gotoText}>Already have an account?</Text>
          <Pressable
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Signup;

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

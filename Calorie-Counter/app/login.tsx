import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); //variable named email and a function named setEmail to update it, initialized to an empty string
  const [password, setPassword] = useState(""); // rest follow the same pattern as above but for password and error
  const [error, setError] = useState(""); 

  const handleLogin = async () => {
    // Clear any old error message
    setError("");

    try {
      // Try to sign the user in with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // If it works, move to the main app
      router.replace("/(tabs)");
    } catch (err: any) {
      // If fail, show the error message
      setError(err.message);
    }
  };


return (
  // Main container for the login screen
  // <View style={{ padding: 20 }}>
  <View style={styles.container}>

    {/* Email label */}
    <Text>Email</Text>

    {/* Email input box */}
    <TextInput style={styles.input}
      value={email}              // what the user typed
      onChangeText={setEmail}    // update email state when typing
      autoCapitalize="none"

    />

    {/* Password label */}
    <Text>Password</Text>

    {/* Password input box */}
    <TextInput style={styles.input}
      value={password}
      onChangeText={setPassword}
      secureTextEntry            // hides the password

    />

    {/* Show error message if login fails */}
    {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

    {/* Login button */}
    <Button title="Login" onPress={handleLogin} />  {/* When pressed, it calls the handleLogin function */}
  </View>
);
}

const styles = StyleSheet.create({ //copied from some other file
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "GoogleSans",
  },
  input:{
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    width: "90%",
  }
});

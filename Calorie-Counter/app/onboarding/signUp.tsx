import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Signup() {
  const router = useRouter();
  const { height, weight, age, sex, motivation, activity, bmi, calorieGoal } = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    // Check if passwords match before calling Firebase
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create the Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // --- Macro Calculations ---
      const w = Number(weight);
      const cals = Number(calorieGoal);

      // Protein (g)
      let proteinPerKg = 1.6;
      if (motivation === "lose") proteinPerKg = 2.0;
      if (motivation === "gain") proteinPerKg = 1.8;
      const proteinGoal = Math.round(w * proteinPerKg);
      const proteinCalories = proteinGoal * 4;

      // Fat (g)
      const fatCalories = cals * 0.30;
      const fatGoal = Math.round(fatCalories / 9);

      // Carbs (g)
      const remainingCalories = cals - (proteinCalories + fatCalories);
      const carbGoal = Math.round(remainingCalories / 4);
      // --------------------------

      // Save onboarding data to Firestore
      await setDoc(
        doc(db, "users", uid),
        {
          height,
          weight,
          age,
          sex,
          motivation,
          activity,
          bmi,
          calorieGoal,
          proteinGoal,
          fatGoal,
          carbGoal,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.replace("/onboarding/BMI_Explanation")}
        style={{ position: "absolute", top: 50, left: 20, padding: 10 }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>← Back</Text>
      </TouchableOpacity>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text>Re-enter Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Create Account" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    width: "90%",
  },
});

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MotivationScreen() {
  const router = useRouter();
  const [selectedMotivation, setSelectedMotivation] = useState<string | null>(null);

  const [details, setDetails] = useState<string[]>([]); // State to store the selected motivation details, initialized as an empty array

  const handleSelect = (motivation: string) => {
    setSelectedMotivation(motivation);    // Update the selected motivation state when a button is pressed
    setDetails((prev: string[]) => [...prev, motivation]);    // Add the selected motivation to the details array using the functional form of setState to ensure we get the latest state

    /* Navigate to the main app screen (tabs) and pass the selected motivation as a parameter */
    router.push({
      pathname: "/activitylevel",
      params: { motivation },
    });
  };

  return (
    <View style={styles.container}>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.replace("/splash")}
        style={{ position: "absolute", top: 50, left: 20, padding: 10 }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Select your motivation</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("lose")}>
        {/* When the "Lose Weight" button is pressed, it calls handleSelect with "lose" */}
        <Text style={styles.buttonText}>Lose Weight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("gain")}>
        <Text style={styles.buttonText}>Gain Weight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("maintain")}>
        <Text style={styles.buttonText}>Maintain Weight</Text>
      </TouchableOpacity>

      {selectedMotivation && (
        <Text style={{ marginTop: 20 }}>Selected: {selectedMotivation}</Text>
      )}
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
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#56b1d4",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignItems: "center",

    // Shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Import useLocalSearchParams to access the motivation parameter passed from the previous screen

export default function ActivityLevelScreen() {
  const router = useRouter();
  const { motivation } = useLocalSearchParams(); // <-- FIX: moved inside component
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleSelect = (level: string) => {
    setSelectedLevel(level);

    router.push({
      pathname: "/(tabs)",   // or wherever you want to go next
      params: { 
        activity: level,
        motivation: motivation,   // passing values forward
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your activity level</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("inactive")}>
        <Text style={styles.buttonText}>Inactive{"\n"}Fewer than 30 minutes a week</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("active")}>
        <Text style={styles.buttonText}>Active{"\n"}Between 30 and 150 minutes a week</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("very_active")}>
        <Text style={styles.buttonText}>Very Active{"\n"}More than 150 minutes a week</Text>
      </TouchableOpacity>

      {selectedLevel && (
        <Text style={{ marginTop: 20 }}>Selected: {selectedLevel}</Text>
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

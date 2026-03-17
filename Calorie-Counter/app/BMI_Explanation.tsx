import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";



export default function ActivityLevelScreen() {
  const router = useRouter();
  const { motivation, activity } = useLocalSearchParams();

  const handleContinue = () => {
    router.push({
      pathname: "/BMI_Calculation",
      params: {
        motivation,
        activity,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's calculate your BMI</Text>

      <Text style={styles.subtitle}>
        Use this calculator to check your body mass index (BMI) and find out if
        you're a healthy weight.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#56b1d4",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

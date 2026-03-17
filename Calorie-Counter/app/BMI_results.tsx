import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BMIResultScreen() {
  const { height, weight, age, sex, motivation, activity } = useLocalSearchParams();
  const router = useRouter();

  const h = Number(height);
  const w = Number(weight);

  const bmi = w / ((h / 100) * (h / 100));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your BMI Result</Text>

      <Text style={styles.bmiValue}>BMI = {bmi.toFixed(2)}</Text>

      <Text style={styles.note}>
        This is calculated using your height and weight.
      </Text>

      {/* Continue button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/(tabs)",
            params: {
              height,
              weight,
              age,
              sex,
              motivation,
              activity,
              bmi: bmi.toFixed(2),
            },
          })
        }
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#56b1d4",
    marginBottom: 20,
  },
  note: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
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

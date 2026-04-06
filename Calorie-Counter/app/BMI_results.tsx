import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BMIResultScreen() {
  const { height, weight, age, sex, motivation, activity } = useLocalSearchParams();
  const router = useRouter();

  const h = Number(height);
  const w = Number(weight);
  const a = Number(age);

  // BMI
  const bmi = w / ((h / 100) * (h / 100));

  // --- Calorie Goal Calculation --- courtesy of the Mifflin-St Jeor equation

  const calculateCalorieGoal = () => {
    // 1. BMR
    let bmr;
    if (sex === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // 2. Activity multiplier
    let multiplier = 1.2;
    if (activity === "active") multiplier = 1.4;
    if (activity === "very_active") multiplier = 1.6;

    const tdee = bmr * multiplier;

    // 3. Goal adjustment
    let calorieGoal = tdee;
    if (motivation === "lose") calorieGoal -= 300;
    if (motivation === "gain") calorieGoal += 300;

    return Math.round(calorieGoal);
  };

  const calorieGoal = calculateCalorieGoal();
  // --------------------------------

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
            params: { // Pass all relevant data to the main app screen
              height,
              weight,
              age,
              sex,
              motivation,
              activity,
              bmi: bmi.toFixed(2),
              calorieGoal,
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

import { Text, View, StyleSheet } from "react-native";
import { auth } from "../../firebase"; 
import { useLocalSearchParams } from "expo-router";

// This is the main page of the app. It loads after onboarding + BMI flow.
// It receives all user data passed through navigation.
export default function Index() {
  const user = auth.currentUser; // Get the currently logged-in user

  // Receive all params passed from the BMIResultScreen
  const { 
    motivation, 
    activity, 
    height, 
    weight, 
    age, 
    sex, 
    bmi,
    calorieGoal // <-- added calorie goal
  } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main page</Text>

      {/* Display logged-in user's email */}
      {user?.email && (
        <Text style={styles.email}>{user.email}</Text>
      )}

      {/* Display motivation */}
      {motivation && (
        <Text style={styles.info}>Motivation: {motivation}</Text>
      )}

      {/* Display activity level */}
      {activity && (
        <Text style={styles.info}>Activity Level: {activity}</Text>
      )}

      {/* Display height */}
      {height && (
        <Text style={styles.info}>Height: {height} cm</Text>
      )}

      {/* Display weight */}
      {weight && (
        <Text style={styles.info}>Weight: {weight} kg</Text>
      )}

      {/* Display age */}
      {age && (
        <Text style={styles.info}>Age: {age}</Text>
      )}

      {/* Display sex */}
      {sex && (
        <Text style={styles.info}>Sex: {sex}</Text>
      )}

      {/* Display BMI */}
      {bmi && (
        <Text style={styles.info}>BMI: {bmi}</Text>
      )}

      {/* Display calorie goal */}
      {calorieGoal && (
        <Text style={styles.info}>Calorie Goal: {calorieGoal} kcal</Text>
      )}
    </View>
  );
}

// Styles for the main page UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 24,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "GoogleSans",
  },
  title: {
    fontSize: 28,
    fontFamily: "GoogleSans",
    textAlign: "center",
  },
  email: {
    fontSize: 20,
    color: "gray",
    marginTop: 10,
    fontFamily: "GoogleSans",
  },
  info: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: "GoogleSans",
  },
});

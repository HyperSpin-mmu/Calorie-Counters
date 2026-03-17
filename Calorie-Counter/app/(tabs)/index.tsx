import { Text, View, StyleSheet } from "react-native";
import { auth } from "../../firebase"; // added import
import { useLocalSearchParams } from "expo-router"; // added import

// This is the main page of the app, it is the default screen that is shown when the app is opened.
export default function Index() {
  const user = auth.currentUser; // added user variable

  // Get all data passed from onboarding + BMI flow
  const { 
    motivation, 
    activity, 
    height, 
    weight, 
    age, 
    sex, 
    bmi 
  } = useLocalSearchParams(); // expanded line

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main page</Text>

      {/* Print the email below */}
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
    </View>
  );
}

// Styles for the main page, including the container and title text styles.
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

import { Text, View, StyleSheet } from "react-native";
import { auth, db } from "../../firebase"; // import Firestore
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useEffect, useState } from "react";

// This is the main page of the app. It loads after onboarding + BMI flow.
// It receives all user data passed through navigation.
export default function Index() {
  const user = auth.currentUser; // Get the currently logged-in user

  //local state to store the user's Firestore profile
  const [profile, setProfile] = useState<any>(null);

  //Load user profile from Firestore using their UID
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return; // safety check

      // Reference the user's document in Firestore
      const ref = doc(db, "users", user.uid);

      // Fetch the document
      const snap = await getDoc(ref);

      // If the document exists, store the data in state
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };

    loadProfile(); // call the async function
  }, [user]); // re-run if user changes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main page</Text>

      {/* Display logged-in user's email */}
      {user?.email && (
        <Text style={styles.email}>{user.email}</Text>
      )}

      {/* Display motivation */}
      {profile?.motivation && (
        <Text style={styles.info}>Motivation: {profile.motivation}</Text>
      )}

      {/* Display activity level */}
      {profile?.activity && (
        <Text style={styles.info}>Activity Level: {profile.activity}</Text>
      )}

      {/* Display height */}
      {profile?.height && (
        <Text style={styles.info}>Height: {profile.height} cm</Text>
      )}

      {/* Display weight */}
      {profile?.weight && (
        <Text style={styles.info}>Weight: {profile.weight} kg</Text>
      )}

      {/* Display age */}
      {profile?.age && (
        <Text style={styles.info}>Age: {profile.age}</Text>
      )}

      {/* Display sex */}
      {profile?.sex && (
        <Text style={styles.info}>Sex: {profile.sex}</Text>
      )}

      {/* Display BMI */}
      {profile?.bmi && (
        <Text style={styles.info}>BMI: {profile.bmi}</Text>
      )}

      {/* Display calorie goal */}
      {profile?.calorieGoal && (
        <Text style={styles.info}>Calorie Goal: {profile.calorieGoal} kcal</Text>
      )}

      {/* Display protein goal */}
      {profile?.proteinGoal && (
        <Text style={styles.info}>Protein Goal: {profile.proteinGoal} g</Text>
      )}

      {/* Display fat goal */}
      {profile?.fatGoal && (
        <Text style={styles.info}>Fat Goal: {profile.fatGoal} g</Text>
      )}

      {/* Display carb goal */}
      {profile?.carbGoal && (
        <Text style={styles.info}>Carb Goal: {profile.carbGoal} g</Text>
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

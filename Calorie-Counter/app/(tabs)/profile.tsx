import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


export default function ProfileScreen() {
  const user = auth.currentUser;
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setProfile(snap.data());
    };
    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    router.replace("/onboarding/splash"); // back to splash
  };

  return (
    <View style={styles.container}>

    <SafeAreaView style={styles.header} edges={['top']}>
    <View style={styles.headerContent}>

        {/* Back Button (recycled from Search screen) */}
        <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.navigate('/')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
        <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>
    </View>
    </SafeAreaView>

    {/* Calorie Goal Card (static display) */}
    <View style={styles.calorieCard}>
    <View style={styles.rowLeft}>
        <MaterialIcons name="flag" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Calorie Goal (kcal)</Text>
    </View>

    <Text style={styles.calorieValue}>
        {profile?.calorieGoal ?? "—"}
    </Text>
    </View>



      {/* Content */}
      {user?.email && <Text style={styles.info}>Email: {user.email}</Text>}
      {profile?.motivation && <Text style={styles.info}>Motivation: {profile.motivation}</Text>}
      {profile?.activity && <Text style={styles.info}>Activity Level: {profile.activity}</Text>}
      {profile?.height && <Text style={styles.info}>Height: {profile.height} cm</Text>}
      {profile?.weight && <Text style={styles.info}>Weight: {profile.weight} kg</Text>}
      {profile?.age && <Text style={styles.info}>Age: {profile.age}</Text>}
      {profile?.sex && <Text style={styles.info}>Sex: {profile.sex}</Text>}
      {profile?.bmi && <Text style={styles.info}>BMI: {profile.bmi}</Text>}
      {profile?.calorieGoal && (
        <Text style={styles.info}>Calorie Goal: {profile.calorieGoal} kcal</Text>
      )}
      {profile?.proteinGoal && (
        <Text style={styles.info}>Protein Goal: {profile.proteinGoal} g</Text>
      )}
      {profile?.fatGoal && <Text style={styles.info}>Fat Goal: {profile.fatGoal} g</Text>}
      {profile?.carbGoal && <Text style={styles.info}>Carb Goal: {profile.carbGoal} g</Text>}

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  /* Header styles copied from SavedMeals */
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    width: "100%",
  },
  headerContent: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },

  title: {
    fontSize: 26,
    fontFamily: "GoogleSans",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginTop: 6,
    fontFamily: "GoogleSans",
  },
  logoutBtn: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#E53935",
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "GoogleSans",
  },
  backButton: {
  position: 'absolute',
  left: 15,
},calorieCard: {
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 16,
  width: '90%',
  marginTop: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  elevation: 1,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},

rowLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

rowLabel: {
  fontSize: 15,
  color: '#212121',
  fontWeight: '500',
},

calorieValue: {
  fontSize: 18,
  fontWeight: '700',
  color: '#1976D2',
},


});

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

   
{/* Content */}
{/* Account info */}
<View style={styles.section}>
  <Text>Account</Text>
  {user?.email && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="email" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Email</Text>
      </View>
      <Text style={styles.calorieValue}>{user.email}</Text>
    </View>
  )}
</View>

{/* User info */}
<View style={styles.section}>
  <Text>User Details</Text>
  {profile?.age && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="cake" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Age</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.age}</Text>
    </View>
  )}
  {profile?.sex && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="person" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Sex</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.sex}</Text>
    </View>
  )}
  {profile?.height && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="height" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Height</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.height} cm</Text>
    </View>
  )}
  {profile?.weight && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="monitor-weight" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Weight</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.weight} kg</Text>
    </View>
  )}
  {profile?.bmi && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="monitor-heart" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>BMI</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.bmi}</Text>
    </View>
  )}
</View>

{/* User goals */}
<View style={styles.section}>
  <Text>Goals</Text>
  {profile?.motivation && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="flag" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Motivation</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.motivation}</Text>
    </View>
  )}
  {profile?.activity && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="directions-run" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Activity Level</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.activity}</Text>
    </View>
  )}
  {profile?.calorieGoal && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="local-fire-department" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Calorie Goal</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.calorieGoal} kcal</Text>
    </View>
  )}
  {profile?.proteinGoal && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="set-meal" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Protein Goal</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.proteinGoal} g</Text>
    </View>
  )}
  {profile?.fatGoal && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="water-drop" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Fat Goal</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.fatGoal} g</Text>
    </View>
  )}
  {profile?.carbGoal && (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialIcons name="grain" size={22} color="#1976D2" />
        <Text style={styles.rowLabel}>Carb Goal</Text>
      </View>
      <Text style={styles.calorieValue}>{profile.carbGoal} g</Text>
    </View>
  )}
</View>
      

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

section: {
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 16,
  width: '90%',
  marginTop: 20,
  elevation: 1,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
  borderBottomWidth: 0.5,
  borderBottomColor: '#f0f0f0',
},


});

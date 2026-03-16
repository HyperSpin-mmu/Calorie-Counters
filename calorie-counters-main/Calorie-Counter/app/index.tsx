import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Donut from "../components/Donut";

let dateTime = new Date();



export default function Index() {
  const [scannedItems, setScannedItems] = useState<any[]>([])//create state to store all the products scanned,
  const [totalKcal, setTotalKcal] = useState(0);
  const calorieGoal = 2000;// set calorie goal to 2000, but will implement a feature asking the user their preferred goal later
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.kcal) {
      setTotalKcal(prev => prev + Number(params.kcal));
    }
  }, [params.kcal]);

  const percentage = (totalKcal / calorieGoal) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Tracker</Text>
      
      <View style={styles.donutContainer}>
        <Donut 
          percentage={percentage} 
          radius={100} 
          strokeWidth={20} 
          duration={700}
          color="#2ecc71" 
          textColor="#333"
        />
        
        
        <View style={styles.labelContainer}>
          <Text style={styles.kcalText}>{totalKcal}</Text>
          <Text style={styles.goalText}>/ {calorieGoal} kcal</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
    textAlign: "center",
  },
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute', // This puts the text right in the center of the ring
    alignItems: 'center',
  },
  kcalText: {
    fontSize: 32,
    fontWeight: '900',
  },
  goalText: {
    fontSize: 14,
    color: '#666',
  }
});



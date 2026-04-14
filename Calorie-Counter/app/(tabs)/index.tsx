import { Text, View, StyleSheet, ScrollView, DimensionValue, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { auth, db } from "../../firebase"; // import Firestore
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'expo-router';
import { useDiaryStore } from '../store/diaryStore';
import { useWaterStore } from "../store/waterStore";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";


export default function Index() {

  const user = auth.currentUser;

  const INITIAL_TARGETS = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  const [TARGETS, setTARGETS] = useState(INITIAL_TARGETS);
    
  const entries = useDiaryStore((state: any) => state.entries);
  const router = useRouter();

  const totalMl = useWaterStore((state) => state.totalMl);
  const dailyGoalMl = useWaterStore((state) => state.dailyGoalMl);

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

    //Load user's macro goals from Firestore on mount
    useEffect(() => {
      const loadTargets = async () => {
        const user = auth.currentUser;
        if (!user) return;
  
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
  
        if (snap.exists()) {
          const data = snap.data();
          setTARGETS({
            calories: Number(data.calorieGoal) || 0,
            carbs:    Number(data.carbGoal)    || 0,
            protein:  Number(data.proteinGoal) || 0,
            fat:      Number(data.fatGoal)     || 0,
          });
        }
      };
  
      loadTargets();
    }, []);
  
  const dailyTotals = useMemo(() => {
    return entries.reduce(
      (totals: any, entry: any) => ({
        calories: totals.calories + Number(entry.macros?.calories || 0),
        carbs: totals.carbs + Number(entry.macros?.carbs || 0),
        protein: totals.protein + Number(entry.macros?.protein || 0),
        fat: totals.fat + Number(entry.macros?.fat || 0),
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0 }
    );
  }, [entries]);

  const getProgress = (current: number, target: number): DimensionValue => {
    if (target === 0) return '0%';
    const percentage = (current / target) * 100;
    return `${Math.min(percentage, 100)}%` as DimensionValue; 
  };

  const progress = TARGETS.calories > 0 ? dailyTotals.calories / TARGETS.calories : 0;
  const offset = circumference * (1 - progress);

return (
    <ScrollView style={styles.content} contentInsetAdjustmentBehavior="automatic">
      <View style={{ padding: 20 }}>
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={[styles.subtitle]}>Here's your summary for today.</Text>

        {/* Card 1 - Calories & Macros */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today's Calories</Text>

          {/* Calorie Ring */}
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#F0F0F5"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#007AFF"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
              />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center' }}>
              <Text style={styles.calorieNumber}>
                {Math.max(0, TARGETS.calories - dailyTotals.calories)}
              </Text>
              <Text style={styles.calorieText}>Remaining</Text>
            </View>
          </View>

          {/* Macro Bars */}
          <View style={[styles.macroRow, { marginTop: 20 }]}>
            <View style={styles.macroColumn}>
              <Text style={styles.cardTitle}>Carbs</Text>
              <Text style={styles.macroValueText}>{dailyTotals.carbs}g <Text style={styles.targetSubText}>/ {TARGETS.carbs}</Text></Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: getProgress(dailyTotals.carbs, TARGETS.carbs), backgroundColor: '#4CAF50' }]} />
              </View>
            </View>
            <View style={[styles.macroColumn, { paddingHorizontal: 10 }]}>
              <Text style={styles.cardTitle}>Fat</Text>
              <Text style={styles.macroValueText}>{dailyTotals.fat}g <Text style={styles.targetSubText}>/ {TARGETS.fat}</Text></Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: getProgress(dailyTotals.fat, TARGETS.fat), backgroundColor: '#FF9800' }]} />
              </View>
            </View>
            <View style={styles.macroColumn}>
              <Text style={styles.cardTitle}>Protein</Text>
              <Text style={styles.macroValueText}>{dailyTotals.protein}g <Text style={styles.targetSubText}>/ {TARGETS.protein}</Text></Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: getProgress(dailyTotals.protein, TARGETS.protein), backgroundColor: '#2196F3' }]} />
              </View>
            </View>
          </View>

        </View>
        {/* End Card 1 */}

        {/* Card 3 - Saved Meals */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Saved Meals</Text>

          <Text style={styles.cardTitle}>
            Quickly log meals you've saved for easy access.
          </Text>

          <TouchableOpacity 
            style={styles.savedButton}
            onPress={() => router.navigate('/saved')}
          >
            <MaterialIcons name="bookmark" size={18} color="#fff" />
            <Text style={styles.savedButtonText}>View Saved Meals</Text>
          </TouchableOpacity>
        </View>

        {/* Card 2 - Water */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today's Water</Text>

          <View style={{ width: '100%', marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={styles.cardTitle}>Daily Goal</Text>
              <Text style={styles.cardTitle}>{totalMl} / {dailyGoalMl} ml</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { 
                width: getProgress(totalMl, dailyGoalMl), 
                backgroundColor: '#56b1d4' 
              }]} />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.waterButton}
            onPress={() => router.navigate('/waterTracker')}
          >
            <MaterialIcons name="water-drop" size={18} color="#fff" />
            <Text style={styles.waterButtonText}>Add Water</Text>
          </TouchableOpacity>

        </View>
        {/* End Card 2 */}



      </View>
    </ScrollView>
  );
}

// Styles for the main page UI
const styles = StyleSheet.create({
  waterButton: {
      backgroundColor: '#56b1d4',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 30,
      alignItems: 'center',
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
  },
  waterButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontFamily: "GoogleSans-Bold",
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginLeft: 5,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "GoogleSans-Regular",
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 20,
    color: "#666",
    textAlign: 'left',
  },
  calorieNumber: {
    fontSize: 24,
    fontFamily: "GoogleSans-Bold",
    fontWeight: "bold",
    color: "#007AFF",
  },
  calorieText: {
    fontSize: 16,
    fontFamily: "GoogleSans-Bold",
    color: "#333",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "GoogleSans-Bold",
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  macroColumn: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  macroValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  targetSubText: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'normal',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F5',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  savedButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  savedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

});

import React, { useMemo, useEffect, useState } from 'react'; //added useEffect, useState to import
import { View, Text, StyleSheet, SectionList, TouchableOpacity, DimensionValue } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDiaryStore } from '../store/diaryStore';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

import { auth, db } from '../../firebase'; // Firebase imports
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

//Targets loaded from Firestore on mount 
const INITIAL_TARGETS = { calories: 0, carbs: 0, protein: 0, fat: 0 };

export default function FoodDiaryScreen() {
  const router = useRouter();
  
  const entries = useDiaryStore((state: any) => state.entries);
  const removeEntry = useDiaryStore((state: any) => state.removeEntry);

  // State to hold targets loaded from Firestore
  const [TARGETS, setTARGETS] = useState(INITIAL_TARGETS);

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
    const percentage = (current / target) * 100;
    return `${Math.min(percentage, 100)}%` as DimensionValue; 
  };

  const groupedEntries = useMemo(() => {
    const sections = [
      { title: 'Breakfast', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Breakfast' || e.mealType === 'breakfast') },
      { title: 'Lunch', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Lunch' || e.mealType === 'lunch') },
      { title: 'Dinner', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Dinner' || e.mealType === 'dinner') },
      { title: 'Snack', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Snack' || e.mealType === 'snack') },
    ];
    return sections.filter((section) => section.data.length > 0);
  }, [entries]);

  const renderRightActions = (progress: any, dragX: any, id: string) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        dragX.value,
        [-100, 0],
        [1, 0],
        Extrapolation.CLAMP
      );
      return {
        transform: [{ scale }],
      };
    });

    return (
      <View style={styles.deleteActionContainer}>
        <TouchableOpacity onPress={() => removeEntry(id)} style={styles.deleteButton}>
          <Reanimated.View style={animatedStyle}>
            <MaterialIcons name="delete" size={24} color="white" />
          </Reanimated.View>
          <Reanimated.Text style={[styles.deleteText, animatedStyle]}>
            Delete
          </Reanimated.Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
      containerStyle={styles.swipeableContainer}
    >
      <View style={styles.foodItem}>
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{item.foodItem || item.name}</Text>
          <Text style={styles.foodAmount}>{item.amount} {item.unit} • {item.brand}</Text>
        </View>
        <View style={styles.macroDetails}>
          <Text style={styles.caloriesText}>{item.macros?.calories} kcal</Text>
        </View>
      </View>
    </Swipeable>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}> 
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.navigate('/')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Today's Diary</Text>
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <SectionList
          ListHeaderComponent={
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>Calories</Text>
                  <Text style={styles.leftText}>{Math.max(0, TARGETS.calories - dailyTotals.calories)} left</Text>
                </View>
                <View style={styles.calRow}>
                  <Text style={styles.highlightValue}>{dailyTotals.calories}</Text>
                  <Text style={styles.targetText}> / {TARGETS.calories} kcal</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: getProgress(dailyTotals.calories, TARGETS.calories), backgroundColor: '#007AFF' }]} />
                </View>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.macroRow}>
                  <View style={styles.macroColumn}>
                    <Text style={styles.cardTitle}>Carbs</Text>
                    <Text style={styles.macroValueText}>{dailyTotals.carbs}g <Text style={styles.targetSubText}>/ {TARGETS.carbs}</Text></Text>
                    <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: getProgress(dailyTotals.carbs, TARGETS.carbs), backgroundColor: '#4CAF50' }]} /></View>
                  </View>
                  <View style={[styles.macroColumn, { paddingHorizontal: 10 }]}>
                    <Text style={styles.cardTitle}>Fat</Text>
                    <Text style={styles.macroValueText}>{dailyTotals.fat}g <Text style={styles.targetSubText}>/ {TARGETS.fat}</Text></Text>
                    <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: getProgress(dailyTotals.fat, TARGETS.fat), backgroundColor: '#FF9800' }]} /></View>
                  </View>
                  <View style={styles.macroColumn}>
                    <Text style={styles.cardTitle}>Protein</Text>
                    <Text style={styles.macroValueText}>{dailyTotals.protein}g <Text style={styles.targetSubText}>/ {TARGETS.protein}</Text></Text>
                    <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: getProgress(dailyTotals.protein, TARGETS.protein), backgroundColor: '#2196F3' }]} /></View>
                  </View>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your diary is empty for today.</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => router.navigate('/action')}>
                <Text style={styles.addBtnText}>Scan a Food</Text>
              </TouchableOpacity>
            </View>
          }
          sections={groupedEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false} 
        />
      </View>
    </View>
  );
}





// --- STYLES --- ///

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  // --- SUMMARY SECTION STYLES ---
  summaryContainer: {
    padding: 20,
    paddingBottom: 5, 
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  leftText: {
    fontSize: 14,
    color: '#888',
  },
  
  // Calories Specific
  calRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  highlightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333', 
  },
  targetText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 4,
  },
  
  // Macros Specific
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  macroColumn: {
    flex: 1,
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

  // Progress Bars
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

  // --- LIST STYLES ---
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20, 
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  foodAmount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  macroDetails: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  
  // --- EMPTY STATE STYLES ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- SWIPEABLE ACTION STYLES ---
  swipeableContainer: {
    marginTop: 10, 
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'visible',
  },
  deleteActionContainer: {
    backgroundColor: '#FF3B30', 
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 12,
    marginLeft: 10, 
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 5,
  },
});
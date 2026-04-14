import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { useWaterStore } from './store/waterStore';

const QUICK_ADD = [150, 250, 330, 500];

export default function WaterTracker() {
  const router = useRouter();
  const { totalMl, dailyGoalMl, addWater } = useWaterStore();
  const [customAmount, setCustomAmount] = useState('');

  const handleQuickAdd = (ml: number) => {
    addWater(ml);
  };

  const progress = Math.min(totalMl / dailyGoalMl, 1);

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Water Tracker</Text>
        </View>
      </SafeAreaView>

      <View style={styles.container}>

        {/* Progress Card */}
        <View style={styles.card}>
          <MaterialIcons name="water-drop" size={32} color="#56b1d4" />
          <Text style={styles.totalText}>{totalMl} ml</Text>
          <Text style={styles.goalText}>of {dailyGoalMl} ml daily goal</Text>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>

        {/* Quick Add Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddRow}>
            {QUICK_ADD.map((ml) => (
              <TouchableOpacity
                key={ml}
                style={styles.quickAddButton}
                onPress={() => handleQuickAdd(ml)}
              >
                <MaterialIcons name="water-drop" size={16} color="#56b1d4" />
                <Text style={styles.quickAddText}>{ml} ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={() => useWaterStore.getState().resetWater()}>
        <Text style={styles.resetButtonText}>Reset Water</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 20,
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
  totalText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#56b1d4',
    marginTop: 8,
  },
  goalText: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F0F0F5',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#56b1d4',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  quickAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: '#EBF7FB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  quickAddText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#56b1d4',
  },
  addButton: {
    backgroundColor: '#56b1d4',
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#56b1d4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
  borderWidth: 1,
  borderColor: '#FF3B30',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 30,
  alignItems: 'center',
  },
  resetButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 16,
  },  
});
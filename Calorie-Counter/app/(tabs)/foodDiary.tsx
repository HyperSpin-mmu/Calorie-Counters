import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDiaryStore } from '../store/diaryStore';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';


const DeleteAction = ({ dragX, onDelete }: { dragX: any, onDelete: () => void }) => {
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
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
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

export default function FoodDiaryScreen() {
  const router = useRouter();
  
  const entries = useDiaryStore((state: any) => state.entries);
  const removeEntry = useDiaryStore((state: any) => state.removeEntry);

  const groupedEntries = useMemo(() => {
    const sections = [
      { title: 'Breakfast', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Breakfast' || e.mealType === 'breakfast') },
      { title: 'Lunch', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Lunch' || e.mealType === 'lunch') },
      { title: 'Dinner', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Dinner' || e.mealType === 'dinner') },
      { title: 'Snack', data: entries.filter((e: { mealType: string; }) => e.mealType === 'Snack' || e.mealType === 'snack') },
    ];
    return sections.filter((section) => section.data.length > 0);
  }, [entries]);

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(_, dragX) => (
        <DeleteAction dragX={dragX} onDelete={() => removeEntry(item.id)} />
      )}
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
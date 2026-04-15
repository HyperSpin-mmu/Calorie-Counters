import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDiaryStore } from '../store/diaryStore';
import { Meal, useMealStore } from '../store/mealStore';

const MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
type MealTime = typeof MEAL_TIMES[number];

export default function SavedMealsScreen() {

  const savedMeals = useMealStore(state => state.savedMeals);
  const { addMeal, updateMeal, deleteMeal, logMeal, loadFromStorage } = useMealStore();

  const logSavedMeal = useDiaryStore((state) => state.logSavedMeal);

  const [formCarbs, setFormCarbs] = useState('');
  const [formProtein, setFormProtein] = useState('');
  const [formFat, setFormFat] = useState('');

  useEffect(() => { loadFromStorage(); }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [formName, setFormName] = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Meal time picker state
  const [mealTimePickerTarget, setMealTimePickerTarget] = useState<Meal | null>(null);

  const openAddModal = () => {
    setEditingMeal(null);
    setFormName('');
    setFormCalories('');
    setFormCarbs('');
    setFormProtein('');
    setFormFat('');
    setModalVisible(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setFormName(meal.name);
    setFormCalories(meal.calories.toString());
    setFormCarbs(meal.carbs?.toString() ?? '');
    setFormProtein(meal.protein?.toString() ?? '');
    setFormFat(meal.fat?.toString() ?? '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      showToast('Please enter a meal name.');
      return;
    }
    const calories = parseInt(formCalories, 10);
    if (isNaN(calories) || calories < 0) {
      showToast('Please enter a valid calorie number.');
      return;
    }
    if (editingMeal) {
      await updateMeal(editingMeal.id, {
        name: formName.trim(),
        calories,
        carbs: Number(formCarbs) || 0,
        protein: Number(formProtein) || 0,
        fat: Number(formFat) || 0,
      });
    } else {
      await addMeal({
        name: formName.trim(),
        calories,
        carbs: Number(formCarbs) || 0,
        protein: Number(formProtein) || 0,
        fat: Number(formFat) || 0,
      });
    }
    setModalVisible(false);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleDelete = (meal: Meal) => {
    setDeleteTarget(meal);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteMeal(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Opens the meal time picker instead of logging directly
  const handleLog = (meal: Meal) => {
    setMealTimePickerTarget(meal);
  };

  // Called when user picks a meal time from the bottom sheet
  const handleMealTimePick = (mealTime: MealTime) => {
    if (!mealTimePickerTarget) return;
    logSavedMeal(mealTimePickerTarget, mealTime);
    showToast(`${mealTimePickerTarget.name} added to ${mealTime}.`);
    setMealTimePickerTarget(null);
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <View style={styles.card}>
      {/* Top row: name + edit/delete icons */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.mealSub}>{item.calories} kcal</Text>
          {(item.carbs || item.protein || item.fat) ? (
            <Text style={styles.mealMacros}>
              {item.carbs ? `Carbs: ${item.carbs}g  ` : ''}
              {item.protein ? `Protein: ${item.protein}g  ` : ''}
              {item.fat ? `Fat: ${item.fat}g` : ''}
            </Text>
          ) : null}
        </View>
        <View style={styles.cardIcons}>
          <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
            <MaterialIcons name="edit" size={20} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}>
            <MaterialIcons name="delete-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add to diary button */}
      <TouchableOpacity style={styles.addToDiaryBtn} onPress={() => handleLog(item)}>
        <MaterialIcons name="add" size={18} color="#1976D2" />
        <Text style={styles.addToDiaryText}>Add to diary</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Meals</Text>
          <TouchableOpacity onPress={openAddModal} style={styles.addBtn}>
            <MaterialIcons name="add" size={28} color="#1976D2" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <FlatList
        data={savedMeals}
        keyExtractor={item => item.id}
        renderItem={renderMeal}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="restaurant" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No saved meals yet.</Text>
            <Text style={styles.emptySubText}>Tap + to add one.</Text>
          </View>
        }
      />

      {/* ── Meal Time Picker Bottom Sheet ── */}
      <Modal
        visible={!!mealTimePickerTarget}
        animationType="slide"
        transparent
        onRequestClose={() => setMealTimePickerTarget(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMealTimePickerTarget(null)}
        >
          <View style={styles.pickerSheet}>
            {/* Drag handle */}
            <View style={styles.dragHandle} />

            {/* Meal name + calories */}
            <Text style={styles.pickerMealName}>{mealTimePickerTarget?.name}</Text>
            <Text style={styles.pickerMealSub}>{mealTimePickerTarget?.calories} kcal · Choose a meal time</Text>

            <View style={styles.divider} />

            {MEAL_TIMES.map((time) => (
              <TouchableOpacity
                key={time}
                style={styles.mealTimeRow}
                onPress={() => handleMealTimePick(time)}
              >
                <Text style={styles.mealTimeLabel}>{time}</Text>
                <MaterialIcons name="chevron-right" size={22} color="#ccc" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setMealTimePickerTarget(null)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Add / Edit Modal ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingMeal ? 'Edit Meal' : 'Add Meal'}</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 6 }}
            >
              <Text style={styles.label}>Meal Name *</Text>
              <TextInput style={styles.input} placeholder="e.g. Chicken Wrap" value={formName} onChangeText={setFormName} />

              <Text style={styles.label}>Calories (kcal) *</Text>
              <TextInput style={styles.input} placeholder="e.g. 450" value={formCalories} onChangeText={setFormCalories} keyboardType="numeric" />

              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput style={styles.input} placeholder="e.g. 30" value={formCarbs} onChangeText={setFormCarbs} keyboardType="numeric" />

              <Text style={styles.label}>Protein (g)</Text>
              <TextInput style={styles.input} placeholder="e.g. 20" value={formProtein} onChangeText={setFormProtein} keyboardType="numeric" />

              <Text style={styles.label}>Fat (g)</Text>
              <TextInput style={styles.input} placeholder="e.g. 10" value={formFat} onChangeText={setFormFat} keyboardType="numeric" />

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancelModalBtn]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelModalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal visible={!!deleteTarget} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderRadius: 20, padding: 24 }]}>
            <Text style={styles.modalTitle}>Delete Meal</Text>
            <Text style={{ fontSize: 15, color: '#555', marginBottom: 20 }}>
              Remove "{deleteTarget?.name}" from saved meals?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelModalBtn]} onPress={() => setDeleteTarget(null)}>
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#E53935' }]} onPress={confirmDelete}>
                <Text style={styles.saveBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Toast ── */}
      {toastMsg && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#f5f5f5' },
  header:             { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerContent:      { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  headerTitle:        { fontSize: 18, fontWeight: '600', color: 'black' },
  addBtn:             { position: 'absolute', right: 15 },
  backButton:         { position: 'absolute', left: 15 },

  list:               { padding: 16, gap: 12 },

  // ── Meal card ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTopRow:         { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  cardInfo:           { flex: 1 },
  mealName:           { fontSize: 20, fontWeight: '700', color: '#212121' },
  mealSub:            { fontSize: 16, color: '#555', marginTop: 4 },
  mealMacros:         { fontSize: 13, color: '#aaa', marginTop: 6 },
  cardIcons:          { flexDirection: 'row', gap: 4, marginLeft: 8 },
  iconBtn:            { padding: 6 },
  addToDiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
  },
  addToDiaryText:     { fontSize: 15, fontWeight: '600', color: '#1976D2' },

  empty:              { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyText:          { fontSize: 16, color: '#aaa', fontWeight: '500' },
  emptySubText:       { fontSize: 13, color: '#ccc' },

  // ── Meal time picker sheet ──
  pickerSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerMealName:     { fontSize: 20, fontWeight: '700', color: '#212121' },
  pickerMealSub:      { fontSize: 14, color: '#888', marginTop: 4, marginBottom: 16 },
  divider:            { height: 1, backgroundColor: '#f0f0f0', marginBottom: 8 },
  mealTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  mealTimeLabel:      { fontSize: 17, color: '#212121', fontWeight: '500' },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelBtnText:      { fontSize: 16, fontWeight: '600', color: '#888' },

  // ── Add/Edit modal ──
  modalOverlay:       { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  modalTitle:         { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#212121' },
  label:              { fontSize: 13, color: '#757575', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
    marginTop: 4,
  },
  modalActions:       { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalBtn:           { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  cancelModalBtn:     { backgroundColor: '#f5f5f5' },
  cancelModalBtnText: { color: '#757575', fontWeight: '600' },
  saveBtn:            { backgroundColor: '#1976D2' },
  saveBtnText:        { color: '#fff', fontWeight: '600' },

  toast: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#323232',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  toastText:          { color: '#fff', fontSize: 14 },
});
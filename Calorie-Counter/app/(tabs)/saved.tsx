import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, Modal, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMealStore, Meal } from '@/store/mealStore';

export default function SavedMealsScreen() {

  const savedMeals = useMealStore(state => state.savedMeals);
  const { addMeal, updateMeal, deleteMeal, logMeal, loadFromStorage } = useMealStore();

  useEffect(() => { loadFromStorage(); }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal]   = useState<Meal | null>(null);
  const [formName,     setFormName]     = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [formServing,  setFormServing]  = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
  const [toastMsg,     setToastMsg]     = useState<string | null>(null);

  const openAddModal = () => {
    setEditingMeal(null);
    setFormName('');
    setFormCalories('');
    setFormServing('');
    setModalVisible(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setFormName(meal.name);
    setFormCalories(meal.calories.toString());
    setFormServing(meal.servingSize ?? '');
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
        name: formName.trim(), calories, servingSize: formServing.trim() || undefined,
      });
    } else {
      await addMeal({
        name: formName.trim(), calories, servingSize: formServing.trim() || undefined,
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

  const handleLog = async (meal: Meal) => {
    await logMeal(meal);
    showToast(`${meal.name} (${meal.calories} kcal) added to today's total.`);
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealSub}>
          {item.calories} kcal{item.servingSize ? `  ·  ${item.servingSize}` : ''}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => handleLog(item)} style={styles.iconBtn}>
          <MaterialIcons name="add-circle-outline" size={26} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
          <MaterialIcons name="edit" size={24} color="#1976D2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}>
          <MaterialIcons name="delete-outline" size={24} color="#E53935" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
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

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingMeal ? 'Edit Meal' : 'Add Meal'}</Text>

            <Text style={styles.label}>Meal Name *</Text>
            <TextInput style={styles.input} placeholder="e.g. Chicken Wrap" value={formName} onChangeText={setFormName} />

            <Text style={styles.label}>Calories (kcal) *</Text>
            <TextInput style={styles.input} placeholder="e.g. 450" value={formCalories} onChangeText={setFormCalories} keyboardType="numeric" />

            <Text style={styles.label}>Serving Size (optional)</Text>
            <TextInput style={styles.input} placeholder="e.g. 1 wrap, 100g" value={formServing} onChangeText={setFormServing} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal visible={!!deleteTarget} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderRadius: 20, padding: 24 }]}>
            <Text style={styles.modalTitle}>Delete Meal</Text>
            <Text style={{ fontSize: 15, color: '#555', marginBottom: 20 }}>
              Remove "{deleteTarget?.name}" from saved meals?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setDeleteTarget(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#E53935' }]} onPress={confirmDelete}>
                <Text style={styles.saveBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toastMsg && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#f5f5f5' },
  header:        { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerContent: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  headerTitle:   { fontSize: 18, fontWeight: '600', color: 'black' },
  addBtn:        { position: 'absolute', right: 15 },
  list:          { padding: 12, gap: 10 },
  card:          { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardInfo:      { flex: 1 },
  mealName:      { fontSize: 16, fontWeight: '600', color: '#212121' },
  mealSub:       { fontSize: 13, color: '#757575', marginTop: 2 },
  cardActions:   { flexDirection: 'row', gap: 4 },
  iconBtn:       { padding: 4 },
  empty:         { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyText:     { fontSize: 16, color: '#aaa', fontWeight: '500' },
  emptySubText:  { fontSize: 13, color: '#ccc' },
  modalOverlay:  { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard:     { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 6 },
  modalTitle:    { fontSize: 20, fontWeight: '700', marginBottom: 8, color: '#212121' },
  label:         { fontSize: 13, color: '#757575', marginTop: 8 },
  input:         { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: '#fafafa', marginTop: 4 },
  modalActions:  { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalBtn:      { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  cancelBtn:     { backgroundColor: '#f5f5f5' },
  cancelBtnText: { color: '#757575', fontWeight: '600' },
  saveBtn:       { backgroundColor: '#1976D2' },
  saveBtnText:   { color: '#fff', fontWeight: '600' },
  toast:         { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#323232', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  toastText:     { color: '#fff', fontSize: 14 },
});
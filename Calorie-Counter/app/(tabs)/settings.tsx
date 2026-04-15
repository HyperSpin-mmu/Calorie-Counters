import { useEffect } from 'react';
import {
  View, Text, Switch, TextInput,
  TouchableOpacity, ScrollView, StyleSheet, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNotificationStore } from '../store/notificationStore';


// ─── Settings Screen ──────────────────────────────────────────────────────────
// Users can configure notification preferences and their daily calorie goal.

export default function SettingsScreen() {
  const router = useRouter();

  const {
    settings, hasPermission,
    loadSettings, requestPermission,
    updateSettings, cancelAll,
  } = useNotificationStore();

  // Load saved settings when screen mounts
  useEffect(() => { loadSettings(); }, []);

  // ── Request permission if not granted ────────────────────────────────────
  const handleEnableNotifications = async (type: keyof typeof settings, value: boolean) => {
    if (value && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to use this feature.'
        );
        return;
      }
    }
    await updateSettings({ [type]: value });
  };

  // ── Save calorie goal ────────────────────────────────────────────────────
  const handleCalorieGoalChange = async (text: string) => {
    const goal = parseInt(text, 10);
    if (!isNaN(goal) && goal > 0) {
      await updateSettings({ calorieGoal: goal });
    }
  };

  // ── Toggle meal reminder time ────────────────────────────────────────────
  const toggleMealTime = async (time: string) => {
    const current = settings.mealReminderTimes;
    const updated = current.includes(time)
      ? current.filter(t => t !== time)
      : [...current, time];
    await updateSettings({ mealReminderTimes: updated });
  };

  // ── Disable all notifications ────────────────────────────────────────────
  const handleDisableAll = async () => {
    Alert.alert('Disable All', 'Turn off all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disable All', style: 'destructive', onPress: async () => {
          await cancelAll();
          await updateSettings({
            mealReminders:  false,
            waterReminders: false,
            calorieAlerts:  false,
          });
        }
      },
    ]);
  };

  const mealTimes = ['08:00', '12:00', '18:00'];
  const mealTimeLabels: Record<string, string> = {
    '08:00': 'Breakfast (8:00 AM)',
    '12:00': 'Lunch (12:00 PM)',
    '18:00': 'Dinner (6:00 PM)',
  };

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* Header */}
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


      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Go to Profile */}
        <TouchableOpacity 
          style={styles.profileBtn}
          onPress={() => router.navigate('/profile')}
        >
          <MaterialIcons name="person" size={20} color="#1976D2" />
          <Text style={styles.profileBtnText}>View Profile</Text>
        </TouchableOpacity>
        

        {/* Permission banner */}
        {!hasPermission && (
          <TouchableOpacity style={styles.permissionBanner} onPress={requestPermission}>
            <MaterialIcons name="notifications-off" size={20} color="#fff" />
            <Text style={styles.permissionText}>Tap to enable notifications</Text>
          </TouchableOpacity>
        )}



        {/* ── Calorie Alerts ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calorie Alerts</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="warning" size={22} color="#F57C00" />
              <View>
                <Text style={styles.rowLabel}>Goal Alerts</Text>
                <Text style={styles.rowSub}>Alert at 90% and 100% of daily goal</Text>
              </View>
            </View>
            <Switch
              value={settings.calorieAlerts}
              onValueChange={v => handleEnableNotifications('calorieAlerts', v)}
              trackColor={{ true: '#1976D2' }}
            />
          </View>
        </View>

        {/* ── Meal Reminders ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Reminders</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="restaurant" size={22} color="#4CAF50" />
              <Text style={styles.rowLabel}>Meal Reminders</Text>
            </View>
            <Switch
              value={settings.mealReminders}
              onValueChange={v => handleEnableNotifications('mealReminders', v)}
              trackColor={{ true: '#1976D2' }}
            />
          </View>

          {settings.mealReminders && (
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Reminder Times</Text>
              {mealTimes.map(time => (
                <TouchableOpacity
                  key={time}
                  style={styles.timeRow}
                  onPress={() => toggleMealTime(time)}
                >
                  <Text style={styles.rowLabel}>{mealTimeLabels[time]}</Text>
                  <MaterialIcons
                    name={settings.mealReminderTimes.includes(time) ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={settings.mealReminderTimes.includes(time) ? '#1976D2' : '#bbb'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Water Reminders ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Reminders</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="water-drop" size={22} color="#29B6F6" />
              <Text style={styles.rowLabel}>Water Reminders</Text>
            </View>
            <Switch
              value={settings.waterReminders}
              onValueChange={v => handleEnableNotifications('waterReminders', v)}
              trackColor={{ true: '#1976D2' }}
            />
          </View>

          {settings.waterReminders && (
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Reminder Interval</Text>
              <View style={styles.intervalRow}>
                {[1, 2, 3, 4].map(hours => (
                  <TouchableOpacity
                    key={hours}
                    style={[
                      styles.intervalBtn,
                      settings.waterReminderInterval === hours && styles.intervalBtnActive,
                    ]}
                    onPress={() => updateSettings({ waterReminderInterval: hours })}
                  >
                    <Text style={[
                      styles.intervalBtnText,
                      settings.waterReminderInterval === hours && styles.intervalBtnTextActive,
                    ]}>
                      {hours}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* ── Disable All ── */}
        <TouchableOpacity style={styles.disableAllBtn} onPress={handleDisableAll}>
          <MaterialIcons name="notifications-off" size={20} color="#E53935" />
          <Text style={styles.disableAllText}>Disable All Notifications</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#f5f5f5' },
  header:             { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerContent:      { height: 50, justifyContent: 'center', alignItems: 'center' },
  headerTitle:        { fontSize: 18, fontWeight: '600', color: 'black' },
  scroll:             { padding: 16, gap: 16 },

  permissionBanner:   { backgroundColor: '#E53935', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  permissionText:     { color: '#fff', fontWeight: '600', fontSize: 14 },

  section:            { backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  sectionTitle:       { fontSize: 13, fontWeight: '700', color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.5 },

  row:                { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft:            { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  rowLabel:           { fontSize: 15, color: '#212121', fontWeight: '500' },
  rowSub:             { fontSize: 12, color: '#9E9E9E', marginTop: 1 },

  goalInput:          { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 8, fontSize: 15, width: 80, textAlign: 'center', backgroundColor: '#fafafa' },

  subSection:         { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, gap: 10, marginTop: 4 },
  subSectionTitle:    { fontSize: 12, color: '#9E9E9E', fontWeight: '600' },

  timeRow:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  intervalRow:        { flexDirection: 'row', gap: 8 },
  intervalBtn:        { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center', backgroundColor: '#fff' },
  intervalBtnActive:  { backgroundColor: '#1976D2', borderColor: '#1976D2' },
  intervalBtnText:    { fontSize: 14, fontWeight: '600', color: '#757575' },
  intervalBtnTextActive: { color: '#fff' },

  disableAllBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FFCDD2', backgroundColor: '#FFF5F5' },
  disableAllText:     { color: '#E53935', fontWeight: '600', fontSize: 15 },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBDEFB',
    backgroundColor: '#E3F2FD',
  },
  profileBtnText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 15,
  },backButton: {
  position: 'absolute',
  left: 15,
},


});
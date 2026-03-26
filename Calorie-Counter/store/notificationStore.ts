import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// ─── Configure how notifications appear when the app is open ─────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationSettings = {
  mealReminders: boolean;       // Remind to log meals
  waterReminders: boolean;      // Remind to drink water
  calorieAlerts: boolean;       // Alert when near/over calorie goal
  calorieGoal: number;          // Daily calorie goal
  mealReminderTimes: string[];  // e.g. ["08:00", "12:00", "18:00"]
  waterReminderInterval: number; // Hours between water reminders
};

type NotificationStore = {
  settings: NotificationSettings;
  hasPermission: boolean;
  updateSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
  requestPermission: () => Promise<boolean>;
  scheduleAll: () => Promise<void>;
  cancelAll: () => Promise<void>;
  checkCalorieGoal: (currentCalories: number) => Promise<void>;
  loadSettings: () => Promise<void>;
};

// ─── Default settings ─────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: NotificationSettings = {
  mealReminders:         true,
  waterReminders:        true,
  calorieAlerts:         true,
  calorieGoal:           2000,
  mealReminderTimes:     ['08:00', '12:00', '18:00'],
  waterReminderInterval: 2,
};

const SETTINGS_KEY = 'notificationSettings';

// ─── Store ────────────────────────────────────────────────────────────────────

export const useNotificationStore = create<NotificationStore>((set, get) => ({

  settings:       DEFAULT_SETTINGS,
  hasPermission:  false,

  // ── Load saved settings from AsyncStorage ──────────────────────────────────
  loadSettings: async () => {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      const saved = json ? JSON.parse(json) : DEFAULT_SETTINGS;
      set({ settings: saved });

      // Check current permission status
      const { status } = await Notifications.getPermissionsAsync();
      set({ hasPermission: status === 'granted' });
    } catch (e) {
      console.error('Failed to load notification settings:', e);
    }
  },

  // ── Request notification permission from the OS ────────────────────────────
  requestPermission: async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    set({ hasPermission: granted });
    return granted;
  },

  // ── Update settings and reschedule notifications ───────────────────────────
  updateSettings: async (updates) => {
    const updated = { ...get().settings, ...updates };
    set({ settings: updated });
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    await get().scheduleAll();
  },

  // ── Cancel all scheduled notifications ────────────────────────────────────
  cancelAll: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // ── Schedule all enabled notifications ────────────────────────────────────
  scheduleAll: async () => {
    const { settings, hasPermission } = get();
    if (!hasPermission) return;

    // Cancel existing ones first to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // ── Meal reminders at specific times ──────────────────────────────────
    if (settings.mealReminders) {
      const mealMessages = [
        { time: '08:00', body: "Good morning! Don't forget to log your breakfast 🍳" },
        { time: '12:00', body: "Lunchtime! Remember to log what you eat 🥗" },
        { time: '18:00', body: "Dinner time! Keep your food diary up to date 🍽️" },
      ];

      for (const reminder of mealMessages) {
        if (settings.mealReminderTimes.includes(reminder.time)) {
          const [hour, minute] = reminder.time.split(':').map(Number);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Meal Reminder',
              body:  reminder.body,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour,
              minute,
            },
          });
        }
      }
    }

    // ── Water reminders every N hours ──────────────────────────────────────
    if (settings.waterReminders) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Water Reminder 💧',
          body:  "Time to hydrate! Aim for 8 glasses a day.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: settings.waterReminderInterval * 60 * 60,
          repeats: true,
        },
      });
    }
  },

  // ── Check calories and fire an alert if needed ─────────────────────────────
  checkCalorieGoal: async (currentCalories) => {
    const { settings, hasPermission } = get();
    if (!hasPermission || !settings.calorieAlerts) return;

    const goal     = settings.calorieGoal;
    const nearGoal = Math.round(goal * 0.9); // 90% of goal

    if (currentCalories >= goal) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ Calorie Goal Reached',
          body:  `You've hit your daily goal of ${goal} kcal. Be mindful of what you eat next!`,
        },
        trigger: null, // Send immediately
      });
    } else if (currentCalories >= nearGoal) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔶 Approaching Calorie Goal',
          body:  `You're at ${currentCalories} kcal — only ${goal - currentCalories} kcal left for today.`,
        },
        trigger: null, // Send immediately
      });
    }
  },
}));
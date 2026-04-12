import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from './store/authStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useDiaryStore } from './store/diaryStore';

export default function RootLayout() {
  const router = useRouter();
  const setUid = useAuthStore((state) => state.setUid);

  // Load custom fonts
  const [loaded, error] = useFonts({
    'GoogleSans': require("../assets/fonts/GoogleSans-Regular.ttf"),
  });

  // Firebase auth listener – runs once the app starts, checks if the user is logged in or out
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User listener for zustand and authStore
        useDiaryStore.persist.setOptions({ name: `diary-${user.uid}` }); // Set the storage key to the user's UID for diary persistence
        useDiaryStore.persist.rehydrate(); // Rehydrate diary store with persisted data 
        router.replace("/(tabs)");
      } else {
        // Not logged in then go to login and reset zustand
        useDiaryStore.getState().clearDiary();
        setUid(null); // Clear UID in authStore when user logs out
        router.replace("/onboarding/splash"); // Redirect to splash screen if not logged in
      }
    });

    return unsub;
  }, []);

  // Hide splash screen when fonts load
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    // <-- Wrapped the Stack in GestureHandlerRootView with flex: 1
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main tab navigator */}
        <Stack.Screen name="(tabs)" />

        {/* Food amount screen */}
        <Stack.Screen 
          name="foodAmount"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        {/* Login screen */}
        <Stack.Screen 
          name="login"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function RootLayout() {
  const router = useRouter();

  // Load custom fonts
  const [loaded, error] = useFonts({
    'GoogleSans': require("../assets/fonts/GoogleSans-Regular.ttf"),
  });

  // Firebase auth listener – runs once the app starts, checks if the user is logged in or out
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Logged in then go to tabs
        router.replace("/(tabs)");
      } else {
        // Not logged in then go to login
        router.replace("/login");
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
  );
}

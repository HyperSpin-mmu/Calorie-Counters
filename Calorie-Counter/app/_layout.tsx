import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// This file handles the transition between the tab navigator and pages that are not in the tab navigator.
export default function RootLayout() {

  // EXPO router for navigation between screens. (https://docs.expo.dev/router/introduction/)
  const router = useRouter();

  // Load custom fonts and keep the splash screen visible until the fonts are loaded.
  const [loaded, error] = useFonts({
    'GoogleSans': require("../assets/fonts/GoogleSans-Regular.ttf"),
  });

  // Hide the splash screen once the fonts are loaded or if there is an error.
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Handles switching between the tab navigator and pages that do not belong to the navigator. (e.g. the food proportion input screen)
  return (
    <Stack screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="(tabs)" /> 
        
        {/* Food amount screen animations and options */}
        <Stack.Screen 
            name="foodAmount" 
            options={{ 
                headerShown: false, 
                animation : 'slide_from_right',
            }} 
        />
    </Stack>
  );
}
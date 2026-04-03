import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// This is the root layout component specifically for the stack navigator. This manages pages that AREN'T 
// part of the main tab navigator (The buttons at the bottom of the screen). If your page is not accessed by the tab navigator,
// it needs to be added here. 

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'GoogleSans': require("../assets/fonts/GoogleSans-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" /> 
          <Stack.Screen 
              name="foodAmount" 
              options={{ 
                  headerShown: false, 
                  animation : 'slide_from_right',
              }} 
          />
      </Stack>
    </GestureHandlerRootView>
  );
}
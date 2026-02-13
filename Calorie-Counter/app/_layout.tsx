import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


//This is the button in the middle of the tab bar, it is used to navigate to the barcode scanner screen.
const BarButton = ({ children, onPress }: { children: any, onPress: any }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View
    // Style for the circular button in the middle of the tab bar.
      style={{
        width: 60, 
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MaterialIcons name="add" size={35} color="white" />
    </View>
  </TouchableOpacity>
);

// This is the root layout of the app, it contains the tab navigator.
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

  // Handle the button press to navigate to the barcode scanner screen.
  const handleButtonPress = () => {
    router.navigate('/action');
  };

  return (
    <Tabs 
    // Configure the tab navigator with custom styles and options.
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#262525', 
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          left: 20,
          right: 20,
          borderRadius: 15,
        }
      }}
      // Define the screens in the tab navigator with their respective options and icons.
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="dashboard" color={color} />,
        }}
      />
        
      <Tabs.Screen
        name="foodDiary"
        options={{
          title: 'Diary',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="book" color={color} />,
        }}
      />

      <Tabs.Screen
        name="action"
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => (
             <BarButton onPress={handleButtonPress} children={undefined} />
          ),
          tabBarStyle: {display: 'none' },
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="search" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="more-horiz" color={color} />,
        }}
      />
      <Tabs.Screen
        name="foodAmount"
        options={{
          // This screen is navigated to from the barcode scanner screen, so we hide it from the tab bar.
          href: null,
        }}
      />
    </Tabs>
  );
}
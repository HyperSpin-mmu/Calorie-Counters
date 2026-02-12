import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const barButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#1375b2',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export default function RootLayout() {

  const router = useRouter();

  const [loaded, error] = useFonts({
    'GoogleSans': require("../assets/fonts/GoogleSans-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const handleButtonPress = () => {
    router.navigate('/action');

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#262525', 
        tabBarStyle: {
          position: 'absolute',
          height: 60,
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 15,
        }
      }}
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
          title: 'Action',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="add-circle-outline" color={color} />,
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
    </Tabs>
  );
}
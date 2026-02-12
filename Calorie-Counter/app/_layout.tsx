import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



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
  };

  return (
    <Tabs 
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
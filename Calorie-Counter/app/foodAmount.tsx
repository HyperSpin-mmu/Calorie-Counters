import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

// This screen is navigated to from the barcode scanner screen, it receives the scanned data as a parameter and displays it.
export default function foodAmountScreen() {

  // Get the scanned data from the navigation parameters passed from the barcode scanner screen. 
  const scannedData = useLocalSearchParams();
  const router = useRouter();

  // Log the received scanned data whenever it changes for debugging purposes.
  useEffect(() => {console.log("Received scanned data:", scannedData); }, [scannedData]);

return (
  // Main container for the food amount screen, it includes a header with a back button and a title, and a content area to display the scanned data.
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.navigate('/')} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
  
          <Text style={styles.headerTitle}>Add Food</Text>
          
        </View>
      </SafeAreaView>

      {/* Main Content Area */}
      <View style={styles.content}>
        <Text style={styles.title}>Food Amount Screen</Text>
        <Text style={styles.message}>Last Scanned: {scannedData.scannedData}</Text>
      </View>
    </View>
  );
}

// Styles for the food amount screen, including the container, header, back button, and content area.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "GoogleSans",
  },
    message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'black',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15, 
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
    headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "black",
  },
});
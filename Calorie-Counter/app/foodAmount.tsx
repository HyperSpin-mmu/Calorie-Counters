import { useLocalSearchParams } from "expo-router";
import { use, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

// This screen is navigated to from the barcode scanner screen, it receives the scanned data as a parameter and displays it.
export default function foodAmountScreen() {

  // Get the scanned data from the navigation parameters passed from the barcode scanner screen.
  const scannedData = useLocalSearchParams();

  // Log the received scanned data whenever it changes for debugging purposes.
  useEffect(() => {console.log("Received scanned data:", scannedData); }, [scannedData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kurt I know you're jealous</Text>
      <Text style={styles.message}>Last Scanned: {scannedData.scannedData}</Text>
      <Text style={styles.message}>I will just call API here... </Text>
    </View>
  );
}

// Styles for the food amount screen, including the container, title, and message text styles.
const styles = StyleSheet.create({
  container: {
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
});
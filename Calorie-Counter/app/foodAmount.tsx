import { useLocalSearchParams } from "expo-router";
import { use, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function foodAmountScreen() {

  const scannedData = useLocalSearchParams();

  useEffect(() => {console.log("Received scanned data:", scannedData); }, [scannedData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kurt I know you're jealous</Text>
      <Text style={styles.message}>Last Scanned: {scannedData.scannedData}</Text>
      <Text style={styles.message}>I will just call API here... </Text>
    </View>
  );
}

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
});
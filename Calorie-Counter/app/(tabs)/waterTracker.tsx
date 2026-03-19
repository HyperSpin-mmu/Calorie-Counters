import { useState } from "react";
import { Alert, Button, Text, View, StyleSheet, TextInput } from "react-native";

export default function WaterTracker() {
  // Create two condition variable: true and false
  // using State
  const True = useState("")
  const False = useState("home")

  // Using simple condtion (the if statement):
  // If the condition is true, show the screen to input the water (UI)
  // Else, return to the home screen
  if (True)
  {
    return (
      <View>
        <TextInput placeholder="e.g., 250ml" />
        <Button title="Enter" onPress={() => Alert.alert("Submitted")} />
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Log</Text>
      <Button title="Log" onPress={() => useState(True)} />
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
    //fontFamily: "GoogleSans",
  }
});
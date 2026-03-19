import { useState } from "react";
import { Alert, Button, Text, View, StyleSheet, TextInput } from "react-native";

export default function WaterTracker() {
  // Create two condition variable: true and false
  // using State
  const [isLogged, setIsLogged] = useState(false) 

  // Using simple condtion (the if statement):
  // If the condition is true, show the screen to input the water (UI)
  // Else, return to the home screen
  if (isLogged) // -> setIsLogged(true)
  {
    return (
      <View>
        <TextInput 
          placeholder="e.g., 250ml"
          style={styles.textinput}
        />
        <Button title="Enter" onPress={() => Alert.alert("Submitted")} />
        <Button title="Back" onPress={() => setIsLogged(false)} />
      </View>
    )
  }
  
  else {    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Water Log</Text>
        <Button title="Log" onPress={() => setIsLogged(true)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "GoogleSans",
  },
  textinput: {
    margin: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: '000',
    borderRadius: 5,
  },
});
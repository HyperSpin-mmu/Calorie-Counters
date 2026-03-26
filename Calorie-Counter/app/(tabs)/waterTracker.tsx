import { useState } from "react";
import { Alert, Button, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function WaterTracker() {
  // Create two condition variable: true and false
  // using State
  const [isLogged, setIsLogged] = useState(false) 

  const [inputValue, setInputValue] = useState("") // -> empty variable

  const handle = (text: string) => { // -> taking text as parameter
    setInputValue(text);
  };
  
  // Adding condition: if the input box is not empty AND is a numerical value (!isNan), enable "Enter" button
  //... else, keep it hidden
  const enableEnterButton = inputValue.trim() !== "" && !isNaN(Number(inputValue));

  // Using simple condtion (the if statement):
  // If the condition is true, show the screen to input the water (UI)
  // Else, return to the home screen
  if (isLogged) // -> setIsLogged(true)
  {
    return (
      <View style={styles.container}>
        <TextInput 
          placeholder="e.g., 250ml"
          style={styles.textinput}
          maxLength={4}
          keyboardType="numeric" // -> enforce numeric value to enter
          onChangeText={handle} // -> linking to the function (handle)
          value={inputValue}
        />

        {/* Condition applies here */}
        {enableEnterButton && (
          <TouchableOpacity
          style={styles.button}
          onPress={() => Alert.alert("Submitted")}
          ><Text style={styles.buttontext}>Enter</Text></TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsLogged(false)}
        ><Text style={styles.buttontext}>Back</Text></TouchableOpacity>
      </View>
    )
  }
  
  else {    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Water Log</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsLogged(true)}
        ><Text style={styles.buttontext}>Log</Text></TouchableOpacity>
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
    margin: 30,
    padding: 20,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black'
  },
  button: {
    margin: 10,
    padding: 5,
    width: 100,
    backgroundColor: '#4285F4',
    borderRadius: 5,
    fontFamily: "GoogleSans",
    textAlign: "center",
    color: 'white',
  },
  buttontext: {
    textAlign: "center",
    color: 'white'
  }
});
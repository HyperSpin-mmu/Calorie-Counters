import { useState } from "react";
import { Alert, Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function WaterTracker() {
  // Create two condition variable: true and false
  // using State
  const [isLogged, setIsLogged] = useState(false) 

  const [inputValue, setInputValue] = useState("") // -> empty variable

  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  const handle = (text: string) => { // -> taking text as parameter
    setInputValue(text);
  };

  const handleReset = () => {setCount(0); setText(''); setInputValue('')}
  
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
        <KeyboardAvoidingView>
          <TextInput
          style={styles.textinput} 
          placeholder="e.g., 250"
          maxLength={4}
          keyboardType="numeric" // -> enforce numeric value to enter
          onChangeText={handle} // -> linking to the function (handle)
          value={inputValue}
        />
        </KeyboardAvoidingView>

        {/* Condition applies here */}
        {enableEnterButton && (
          <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          ><Text style={styles.buttontext}>Enter</Text></TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsLogged(false)}
        ><Text style={styles.buttontext}>Back</Text></TouchableOpacity>

        <Picker>
          <Picker.Item label="ml" value="ml"/>
          <Picker.Item label="l" value="l"/>
        </Picker>
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
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    textAlign: 'center',
    fontSize: 25
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
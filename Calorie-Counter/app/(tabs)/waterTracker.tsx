import { useState } from "react";
import { Alert, Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function WaterTracker() {
  // Create two condition variable: true and false
  // using State
  const [isLogged, setIsLogged] = useState(false) 

  const [inputValue, setInputValue] = useState('') // -> empty variable

  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  const [waterMeasurement, setWaterMeasurement] = useState({amount: 0, unit: ''}) // -> type number for 'amount' and string for 'unit'
  const [unitValue, setUnitValue] = useState('ml') // -> default value

  const handle = (text: string) => { // -> taking text as parameter (type string)
    setInputValue(text); // -> setting value as the user's input
  };

  const handleSetWaterValue = (text: number) => { // (type number/integer)
    // If amount > 1 and unit == litres, stop program
    if (text > 1 && unitValue == 'l') {
      Alert.alert("Exceeded limit (>1 l)")
    }

    else {
      setWaterMeasurement({ amount: text, unit: unitValue }); // -> value stored here
      setCount(0); setText(''); setInputValue('') // -> reset text input
    }
  }
  
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
          style={styles.textinput} 
          placeholder="e.g., 250"
          maxLength={4}
          keyboardType="numeric" // -> enforce numeric value to enter
          onChangeText={handle} // -> linking to the function (handle)
          value={inputValue}
        />

        <Picker style={styles.picker} selectedValue={unitValue} onValueChange={(itemValue) => setUnitValue(itemValue)}>
          <Picker.Item label="ml" value="ml"/>
          <Picker.Item label="l" value="l"/>
        </Picker>

        {/* Condition applies here */}
        {enableEnterButton && (
          <TouchableOpacity
          style={styles.button}
          onPress={() => {handleSetWaterValue(Number(inputValue))}}
          ><Text style={styles.buttontext}>Enter</Text></TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsLogged(false)}
        ><Text style={styles.buttontext}>Back</Text></TouchableOpacity>

        <Text style={styles.text}>Latest Water Logged: {waterMeasurement.amount} {waterMeasurement.unit}</Text>
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
    width: 'auto',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 25,
    backgroundColor: 'white'
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
  },
  text: {
    fontSize: 25
  },
  picker: {
    fontSize: 25,
    borderRadius: 5,
    height: 30
  }
});
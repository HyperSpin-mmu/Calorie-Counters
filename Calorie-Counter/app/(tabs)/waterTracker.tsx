import React, { useState, useEffect } from "react";
import { Alert, Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";

// -- Safe Zustand Import --
// Import directly from the 'vanilla' and 'react' entry points 
// to avoid the middleware that usually causes the import.meta error.
import { create } from 'zustand';

interface WaterState {
  isLogged: boolean;
  waterMeasurement: { amount: number; unit: string };
  setIsLogged: (val: boolean) => void;
  setWaterMeasurement: (amount: number, unit: string) => void;
}

// Removing 'persist' for a moment to stop the 'import.meta' crash
export const useWaterState = create<WaterState>((set) => ({
  isLogged: false,
  waterMeasurement: { amount: 0, unit: 'ml' },
  setIsLogged: (val) => set({ isLogged: val }),
  setWaterMeasurement: (amount, unit) => set({ waterMeasurement: { amount, unit } }),
}));

export default function WaterTracker() {
  const { isLogged, setIsLogged, waterMeasurement, setWaterMeasurement } = useWaterState();
  const [inputValue, setInputValue] = useState('');
  const [unitValue, setUnitValue] = useState('ml');
  
  // Ensure the component is mounted before rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSetWaterValue = () => {
    const amount = Number(inputValue);
    if (amount > 1 && unitValue === 'l') {
      Alert.alert("Exceeded limit (>1 l)");
    } else {
      setWaterMeasurement(amount, unitValue);
      setInputValue('');
    }
  };

  const enableEnterButton = inputValue.trim() !== "" && !isNaN(Number(inputValue));

  return (
    <View style={styles.container}>
      {isLogged ? (
        <>
          <TextInput
            style={styles.textinput} 
            placeholder="e.g., 250"
            maxLength={4}
            keyboardType="numeric"
            onChangeText={setInputValue}
            value={inputValue}
          />

          <Picker 
            style={styles.picker} 
            selectedValue={unitValue} 
            onValueChange={(itemValue) => setUnitValue(itemValue)}
          >
            <Picker.Item label="ml" value="ml"/>
            <Picker.Item label="l" value="l"/>
          </Picker>

          {enableEnterButton && (
            <Pressable style={styles.button} onPress={handleSetWaterValue}>
              <Text style={styles.buttontext}>Enter</Text>
            </Pressable>
          )}

          <Pressable style={styles.button} onPress={() => setIsLogged(false)}>
            <Text style={styles.buttontext}>Back</Text>
          </Pressable>

          <Text style={styles.text}>
            Latest: {waterMeasurement.amount} {waterMeasurement.unit}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Water Log</Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              console.log("Button Clicked!");
              setIsLogged(true);
            }}
          >
            <Text style={styles.buttontext}>Log</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //minHeight: Platform.OS === 'web' ? '100vh' : 'auto',
  },
  title: {
    fontSize: 28,
    fontFamily: 'GoogleSans',
  },
  textinput: {
    height: 40,
    minWidth: 150,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 25,
    backgroundColor: 'white'
  },
  button: {
    margin: 10,
    padding: 15,
    width: 100,
    backgroundColor: '#4285F4',
    borderRadius: 5,
    fontFamily: 'GoogleSans',
    textAlign: 'center',
    color: 'white',
    cursor: 'pointer'
  },
  buttontext: {
    textAlign: 'center',
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
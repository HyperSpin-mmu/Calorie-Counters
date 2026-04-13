import React, { useState, useEffect } from "react";
import { Alert, Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";

// -- Safe Zustand Import --
// Import directly from the 'vanilla' and 'react' entry points 
// to avoid the middleware that usually causes the import.meta error.
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [ inputValue, setInputValue ] = useState('');
  const [ unitValue, setUnitValue ] = useState('ml');
  
  // Ensure the component is mounted before rendering
  const [ mounted, setMounted ] = useState(false);
  
  // Manual Persist using the useEffect
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('water-tracker-manual');
      if (saved) {
        const parsed = JSON.parse(saved);
        setWaterMeasurement(parsed.amount, parsed.unit);
      }
      setMounted(true);
    };

    loadData(); // Function to load and save user water data 
  }, []);

  if (!mounted) return null;

  // A boolean variable to track if the limit is exceeded
  const isExceeded = unitValue === 'l' && Number(inputValue) > 1 || unitValue === 'ml' && Number(inputValue) > 1000;

  const handleSetWaterValue = () => {
    const amount = Number(inputValue);
    if (amount > 1 && unitValue === 'l' || amount > 1000 && unitValue === 'ml') {
      Alert.alert("Exceeded limit (> 1l)");
    } else {
      setWaterMeasurement(amount, unitValue);
      setInputValue('');
    }
  };

  const enableEnterButton = inputValue.trim() !== "" && !isNaN(Number(inputValue));

  // Reactive Glass Fill Up
  // Calculate total ML including what the user is currently typing
  const typedAmount = !isNaN(Number(inputValue)) ? Number(inputValue) : 0;
  const typedAmountMl = unitValue === 'l' ? typedAmount * 1000 : typedAmount;

  const storedAmountMl = waterMeasurement.unit === 'l' 
    ? waterMeasurement.amount * 1000 
    : waterMeasurement.amount;

  const displayTotalMl = storedAmountMl + typedAmountMl;

  // Calculate how many blocks to show (1 block per 100ml)
  const totalBlocks = Math.floor(displayTotalMl / 200);

  return (
    <View style={styles.container}>
      {isLogged ? (
        <>          
          {/* --- Visual Glass Container --- */}
          <View style={styles.glassContainer}>
          <View style={styles.glassFrame}>
            {Array.from({ length: totalBlocks }).map((_, index) => (
              <View key={index} style={styles.waterBlock} />
            ))}
          </View>
            <Text style={styles.glassLabel}>
              {displayTotalMl}ml total ({totalBlocks} blocks)
            </Text>
          </View>

          <TextInput
            style={[ styles.textinput, isExceeded && { backgroundColor: 'red' } ]} // Override default if exceeded
            placeholder="e.g., 250"
            maxLength={4}
            keyboardType="numeric"
            onChangeText={setInputValue}
            value={inputValue}
          />

          <View style={styles.pickerWrapper}>
            <Picker 
              style={styles.picker}
              itemStyle={styles.iosItemStyle} 
              selectedValue={unitValue} 
              onValueChange={(itemValue) => setUnitValue(itemValue)}
              dropdownIconColor="black"
              mode="dropdown"
            >
              <Picker.Item label="ml" value="ml" color="black" />
              <Picker.Item label="l" value="l" color="black" />
            </Picker>
          </View>

          <View style={styles.buttonGroup}>
            {enableEnterButton && (
              <Pressable style={styles.button} onPress={handleSetWaterValue}>
                <Text style={styles.buttontext}>Enter</Text>
              </Pressable>
            )}

            <Pressable style={styles.button} onPress={() => setIsLogged(false)}>
              <Text style={styles.buttontext}>Back</Text>
            </Pressable>
          </View>

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
  pickerWrapper: {
    width: 150,
    height: 50,
    borderRadius: 5,
    marginVertical: 10, // Adds space above and below the picker
    zIndex: 10,         // Ensures it sits on top of other elements
    elevation: 10,      // Required for Android z-indexing
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: 'black'
  },
  buttonGroup: {
    alignItems: 'center',
    zIndex: 1,          // Keeps buttons below the picker dropdown
  },
  iosItemStyle: {
    height: 50, // Height of the individual text item
    fontSize: 18,
    color: 'black', // Forces the text colour on iOS
  },
  glassContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  glassFrame: {
    width: 60,
    height: 100,
    maxHeight: 100, // Space for about 5 blocks (1.0L)
    borderWidth: 3,
    borderColor: '#333',
    borderTopWidth: 0, // Open top like a glass
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'flex-end', // Fills from the bottom up
    padding: 2,
    backgroundColor: '#f0f0f0',
  },
  waterBlock: {
    width: '100%',
    height: 18, // Height of one block
    backgroundColor: '#4285F4',
    marginBottom: 2,
    borderRadius: 2,
  },
  glassLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  }
});
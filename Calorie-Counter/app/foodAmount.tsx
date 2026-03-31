import { useLocalSearchParams } from "expo-router";
import { use, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter} from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchFoodData } from "./services/api"; 
import { useDiaryStore } from "./store/diaryStore";


// This screen is navigated to from the barcode scanner screen, it receives the scanned data as a parameter and displays it.
export default function foodAmountScreen() {

  const [foodData, setFoodData] = useState<{ name: any; brand: any; calories: any; carbs: any; protein: any; fat: any; } | null>(null);

  // Get the scanned data from the navigation parameters passed from the barcode scanner screen. 
  const addEntry = useDiaryStore((state: any) => state.addEntry);
  const { scannedData } = useLocalSearchParams();
  const router = useRouter();

  // Set up state for the amount, unit, and meal type inputs, as well as the food data and loading status.
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState("serving");
  const [mealType, setMealType] = useState("breakfast");

  // Handle the "Add to Diary" button press, show an alert and navigate to the food diary screen if the user chooses to view the diary.
  const handleAddToDiary = () => {
    if (!foodData) return;

    const diaryEntry = {
      id : Date.now().toString(),
      name: foodData.name,
      brand: foodData.brand,
      amount: amount,
      unit: unit,
      mealType: mealType,
      macros: {
        calories: calculateMacro(foodData.calories),
        carbs: calculateMacro(foodData.carbs),
        protein: calculateMacro(foodData.protein),
        fat: calculateMacro(foodData.fat),
      },
      timestamp: new Date().toISOString(),
    };

    // addEntry(diaryEntry); // THIS IS WHERE THE ENTRY IS ADDED TO THE DIARY STORE -------------------> 

    Alert.alert(
      "Food Added! 🎉", 
      "This food item has been added to your diary.",
      [
        {
          // Option to view the diary, which navigates to the food diary screen.
          text: "View Diary",
          onPress: () => router.navigate('/foodDiary'),
        },
        {
          // Option to add more food items, which navigates back to the barcode scanner screen.
          text: "Add More",
          style: "cancel",
          onPress: () => router.replace('/action'),
        },
      ]
    );
  }

  // State to hold the fetched food data and loading status.
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the food data based on the scanned barcode when the component mounts or when the scanned data changes.
  useEffect(() => {
    async function loadFoodData() {
      if (scannedData && typeof scannedData === "string") {
        setIsLoading(true);

      try {
        // Fetch the food data using the scanned barcode and update the state with the fetched data.
        const result = await fetchFoodData(scannedData as string);
        setFoodData(result);
      } catch (error) {
          console.error("Error loading food data:", error);
          setFoodData(null);
        } finally {
          setIsLoading(false);
        }
    } else if (scannedData) {
        console.warn("Scanned data is not a string:", scannedData);
        setFoodData(null);
        setIsLoading(false);
      }
  }
  // Call the function to load the food data.
    loadFoodData();
  }, [scannedData]);

  // Function to calculate the adjusted macro values based on the entered amount and selected unit.
  const calculateMacro = (baseValue: any) => {
    if (!baseValue || isNaN(baseValue)) return 0;

    // Parse the base value and the entered amount as numbers, defaulting to 0 if the amount is not a valid number.
    const numericValue = parseFloat(baseValue as string);
    const amountValue = parseFloat(amount) || 0;

    // Amount multiplier based on selected unit.
    let multiplier = 1;

    if (unit === "g" || unit === "ml") {
      multiplier = amountValue / 100;
    } else {
      multiplier = amountValue;
    }
    // Calculate the adjusted macro value by multiplying the base value with the multiplier and rounding to 0 decimal places.
    return (numericValue * multiplier).toFixed(0);
  };

  
return (
  // Main container for the food amount screen, it includes a header with a back button and a title, and a content area to display the scanned data.
  <KeyboardAvoidingView 
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
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
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" alwaysBounceVertical={true}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : foodData ? (
          <>
            {/* --- FIRST CARD: Food Information --- */}
            <View style={styles.card}>
              {/* Product Name and Brand */}
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>{foodData.name}</Text>
                <Text style={styles.brandSubtitle} numberOfLines={1}>{foodData.brand}</Text>
              </View>
              
              {/* Calories */}
              <View style={styles.calorieContainer}>
                <Text style={styles.calorieValue}>{calculateMacro(foodData.calories)}</Text>
                <Text style={styles.calorieLabel}>kcal</Text>
              </View>

              {/* Macros */}
              <View style={styles.macroRow}>
                {/* Carbs */}
                <View style={[styles.macroBox, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={styles.macroValue}>{calculateMacro(foodData.carbs)}g</Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                {/* Protein */}
                <View style={[styles.macroBox, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={styles.macroValue}>{calculateMacro(foodData.protein)}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                {/* Fat */}
                <View style={[styles.macroBox, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={styles.macroValue}>{calculateMacro(foodData.fat)}g</Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
              </View>
            </View>

            {/* --- SECOND CARD: Portion Adjustments --- */}
            <View style={styles.card}>

              {/* Section Title */}
              <Text style={styles.sectionTitle}>Enter Amount: </Text>
              <View style={styles.inputContainer}>

                {/* Number Input */}
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  maxLength={5}
                  selectTextOnFocus 
                />

                {/* Unit Toggle Buttons */}
                <View style={styles.unitToggleContainer}>
                  <TouchableOpacity 
                    style={[styles.unitButton, unit === 'serving' && styles.unitButtonActive]}
                    onPress={() => setUnit('serving')}
                  >
                    {/* The unit toggle buttons allow the user to switch between entering the amount in servings or in g/ml. The active button is highlighted to indicate the current selection. */}
                    <Text style={[styles.unitButtonText, unit === 'serving' && styles.unitButtonTextActive]}>
                      Serving
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.unitButton, unit === 'g' && styles.unitButtonActive]}
                    onPress={() => setUnit('g')}
                  >
                    <Text style={[styles.unitButtonText, unit === 'g' && styles.unitButtonTextActive]}>
                      g / ml
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* --- THIRD CARD: Meal Type --- */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Meal Time:</Text>
              
              {/* Meal type selection buttons, allowing the user to categorize the food item as breakfast, lunch, dinner, or snack. The active meal type is highlighted to indicate the current selection. */}
              <View style={styles.mealTypeContainer}>
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((meal) => (
                  <TouchableOpacity
                    key={meal}
                    style={[
                      styles.mealButton,
                      mealType === meal && styles.mealButtonActive
                    ]}
                    onPress={() => setMealType(meal)}
                  >
                    <Text style={[
                      styles.mealButtonText,
                      mealType === meal && styles.mealButtonTextActive
                    ]}>
                      {meal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Call to Action Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddToDiary}>
              <Text style={styles.addButtonText}>Add to Diary</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.message}>No data found for the scanned item.</Text>
        )}
      </ScrollView>
    </View>  
  </KeyboardAvoidingView>
);
}

// Styles for the food amount screen, including the container, header, back button, and content area.
const styles = StyleSheet.create({

  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },

  // Title Styles
  brandSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "GoogleSans",
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: "GoogleSans",
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 5,
    color: '#111111',
  },

  // Calorie Styles
  calorieContainer: {
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 30,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: -5,
  },

  // Macro Styles
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  macroBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },

  // Add to Diary Button Styles
  addButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Portion Input Styles
  portionLabel: {
    fontSize: 16,
    color: '#666',
  },
  portionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  portionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  // General Styles
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'black',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 25,
    paddingBottom: 40, 
  },

  // Header Styles
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
    headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "black",
  },
  

  // Back Button Style
  backButton: {
    position: 'absolute',
    left: 15, 
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  numberInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F0F0F5',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 10,
    color: '#888',
  },

  // Unit Toggle Styles
  unitToggleContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F0F0F5',
    borderRadius: 12,
    padding: 4,
    height: 50,
  },
  unitButton: {
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  unitButtonTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },

  // Meal Type Styles
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  mealButton: {
    width: '48%',
    paddingVertical: 12,
    backgroundColor: '#F0F0F5',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  mealButtonActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mealButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  mealButtonTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
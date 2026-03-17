import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";


export default function BMICalculatorScreen() {
  
  const { motivation, activity } = useLocalSearchParams();
  const router = useRouter();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("female");

const handleCalculate = () => {
  router.push({
    pathname: "/BMI_results",
    params: {
      height,
      weight,
      age,
      sex,
      motivation,
      activity,
    },
  });
};



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>BMI calculator</Text>

        <Text style={styles.subtitle}>
          Use this calculator to check your body mass index (BMI) and find out if you're a healthy weight
        </Text>

        {/* Height */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            placeholder="cm"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        {/* Weight */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        {/* Sex */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sex</Text>
          <View style={styles.sexRow}>
            <TouchableOpacity
              style={[styles.sexButton, sex === "female" && styles.sexSelected]}
              onPress={() => setSex("female")}
            >
              <Text style={styles.sexText}>Female</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sexButton, sex === "male" && styles.sexSelected]}
              onPress={() => setSex("male")}
            >
              <Text style={styles.sexText}>Male</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateText}>Calculate your BMI</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  sexRow: {
    flexDirection: "row",
    gap: 12,
  },
  sexButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  sexSelected: {
    backgroundColor: "#56b1d4",
    borderColor: "#56b1d4",
  },
  sexText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  calculateButton: {
    backgroundColor: "#56b1d4",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 40,
    alignItems: "center",
  },
  calculateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

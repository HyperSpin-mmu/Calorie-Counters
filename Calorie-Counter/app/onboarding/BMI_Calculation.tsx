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
    SafeAreaView,
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
        if (!height || !weight || !age) return;

        router.push({
            pathname: "/onboarding/BMI_results",
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Back button at the top level */}
                <TouchableOpacity
                    onPress={() => router.replace("/onboarding/BMI_Explanation")}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* MOVE: Progress Bar INSIDE the ScrollView to get the horizontal padding */}
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: "85%" }]} />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.title}>BMI calculator</Text>
                        <Text style={styles.subtitle}>
                            Enter your details to calculate your body mass index accurately.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {/* Height Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Height</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={height}
                                    onChangeText={setHeight}
                                    placeholderTextColor="#9CA3AF"
                                />
                                <Text style={styles.unitText}>cm</Text>
                            </View>
                        </View>

                        {/* Weight Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Weight</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                    placeholderTextColor="#9CA3AF"
                                />
                                <Text style={styles.unitText}>kg</Text>
                            </View>
                        </View>

                        {/* Age Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Age</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="How old are you?"
                                    keyboardType="numeric"
                                    value={age}
                                    onChangeText={setAge}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Sex Selection */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Sex</Text>
                            <View style={styles.sexRow}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.sexButton, sex === "female" && styles.sexSelected]}
                                    onPress={() => setSex("female")}
                                >
                                    <Text style={[styles.sexText, sex === "female" && styles.sexTextActive]}>Female</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.sexButton, sex === "male" && styles.sexSelected]}
                                    onPress={() => setSex("male")}
                                >
                                    <Text style={[styles.sexText, sex === "male" && styles.sexTextActive]}>Male</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.calculateButton, (!height || !weight || !age) && styles.buttonDisabled]}
                        onPress={handleCalculate}
                        disabled={!height || !weight || !age}
                    >
                        <Text style={styles.calculateText}>Calculate your BMI</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6FBF7",
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginTop: 10,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4B5563",
    },
    scrollContent: {
        paddingHorizontal: 24, // This ensures the Progress Bar has left/right space
        paddingBottom: 40,
    },
    progressContainer: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        marginTop: 10, // Adjusted for the ScrollView context
        marginBottom: 20,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%", // Fixed from 95%
        backgroundColor: "#16A34A",
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#111827",
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        marginTop: 8,
        lineHeight: 22,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 8,
        marginLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: "#111827",
        fontWeight: "500",
    },
    unitText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#9CA3AF",
        marginLeft: 8,
    },
    sexRow: {
        flexDirection: "row",
        gap: 12,
    },
    sexButton: {
        flex: 1,
        height: 56,
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    sexSelected: {
        backgroundColor: "#16A34A",
        borderColor: "#16A34A",
    },
    sexText: {
        color: "#4B5563",
        fontSize: 16,
        fontWeight: "600",
    },
    sexTextActive: {
        color: "#FFFFFF",
    },
    calculateButton: {
        backgroundColor: "#16A34A",
        height: 60,
        borderRadius: 20,
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#16A34A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: "#A7F3D0",
        shadowOpacity: 0,
        elevation: 0,
    },
    calculateText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
});
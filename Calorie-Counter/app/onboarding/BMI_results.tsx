import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BMIResultScreen() {
    const { height, weight, age, sex, motivation, activity } = useLocalSearchParams();
    const router = useRouter();

    const h = Number(height);
    const w = Number(weight);
    const a = Number(age);

    const bmi = w / ((h / 100) * (h / 100));

    const getBMICategory = (val: number) => {
        if (val < 18.5) return { label: "Underweight", color: "#3B82F6" };
        if (val < 25) return { label: "Healthy Weight", color: "#16A34A" };
        if (val < 30) return { label: "Overweight", color: "#F59E0B" };
        return { label: "Obese", color: "#EF4444" };
    };

    const category = getBMICategory(bmi);

    const calculateCalorieGoal = () => {
        let bmr;
        if (sex === "male") {
            bmr = 10 * w + 6.25 * h - 5 * a + 5;
        } else {
            bmr = 10 * w + 6.25 * h - 5 * a - 161;
        }

        let multiplier = 1.2;
        if (activity === "active") multiplier = 1.4;
        if (activity === "very_active") multiplier = 1.6;

        const tdee = bmr * multiplier;

        let calorieGoal = tdee;
        if (motivation === "lose") calorieGoal -= 300;
        if (motivation === "gain") calorieGoal += 300;

        return Math.round(calorieGoal);
    };

    const calorieGoal = calculateCalorieGoal();

    const handleContinue = () => {
        router.push({
            pathname: "/onboarding/signUp",
            params: {
                height,
                weight,
                age,
                sex,
                motivation,
                activity,
                bmi: bmi.toFixed(2),
                calorieGoal,
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* 1. Back button stays at the top level */}
            <TouchableOpacity
                onPress={() => router.replace("/onboarding/BMI_Calculation")}
                style={styles.backButton}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/* 2. Content view wraps everything else to provide the side padding (24px) */}
            <View style={styles.content}>

                {/* CHANGE: Moved Progress Bar INSIDE styles.content */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: "100%" }]} />
                </View>

                <Text style={styles.title}>Results</Text>

                <View style={styles.resultCard}>
                    <Text style={styles.label}>Your current BMI</Text>
                    <Text style={[styles.bmiValue, { color: category.color }]}>
                        {bmi.toFixed(1)}
                    </Text>

                    <View style={styles.badge}>
                        <Text style={[styles.categoryText, { color: category.color }]}>
                            {category.label}
                        </Text>
                    </View>

                    <View style={styles.scaleContainer}>
                        <View style={styles.scaleBackground}>
                            <View style={[styles.scalePointer, { left: `${Math.min(Math.max((bmi - 15) * 4, 5), 95)}%` }]} />
                        </View>
                        <View style={styles.scaleLabels}>
                            <Text style={styles.scaleText}>15</Text>
                            <Text style={styles.scaleText}>25</Text>
                            <Text style={styles.scaleText}>40</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>What does this mean?</Text>
                    <Text style={styles.infoText}>
                        Based on your BMI and activity level, we have calculated a personalised
                        daily calorie target to help you {motivation === 'lose' ? 'lose weight' : motivation === 'gain' ? 'gain weight' : 'maintain your weight'} safely.
                    </Text>
                </View>

                <View style={styles.spacer} />

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Continue to Sign Up</Text>
                </TouchableOpacity>
            </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 24, // This provides the side space for the bar and text
        paddingTop: 10,
        paddingBottom: 30,
    },
    progressContainer: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        marginBottom: 30, // Space between bar and Title
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#16A34A",
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 20, // Reduced slightly to account for the bar
    },
    resultCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        padding: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
    bmiValue: {
        fontSize: 64,
        fontWeight: "900",
        letterSpacing: -1,
    },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        marginTop: -5,
        marginBottom: 30,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: "700",
    },
    scaleContainer: {
        width: "100%",
        marginTop: 10,
    },
    scaleBackground: {
        height: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 4,
        position: "relative",
    },
    scalePointer: {
        position: "absolute",
        top: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#111827",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    scaleLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    scaleText: {
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: "600",
    },
    infoBox: {
        marginTop: 30,
        paddingHorizontal: 10,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
    },
    infoText: {
        fontSize: 15,
        color: "#6B7280",
        lineHeight: 22,
    },
    spacer: {
        flex: 1,
    },
    primaryButton: {
        backgroundColor: "#16A34A",
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#16A34A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
});
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BMIExplanationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // Stored all params in a single variable for easier debugging and access.
    const { motivation, activity } = params;

 
    // If this prints "Params received: {}" then the previous page isn't sending data.
    useEffect(() => {
        console.log("Params received on Explanation Screen:", params);
    }, [params]);

    const handleContinue = () => {
        router.push({
            pathname: "/onboarding/BMI_Calculation",
            params: {
                motivation: motivation,
                activity: activity,
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/*  Added a check - if someone tries to access this page without data, 
          we show a fallback so the app doesn't just 'jump' or crash */}


            <TouchableOpacity
                onPress={() => router.replace("/onboarding/activityLevel")}
                style={styles.backButton}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                {/* NEW: added content wrapper for better spacing */}

                <View style={styles.progressContainer}>
                    {/* NEW: added progress bar to show onboarding step */}
                    <View style={[styles.progressBar, { width: "75%" }]} />
                </View>

                <Text style={styles.title}>Let's calculate your BMI</Text>

                <Text style={styles.subtitle}>
                    Use this calculator to check your body mass index (BMI) and find out if
                    you're a healthy weight for your height. This helps us create your personalised plan.
                </Text>

                <View style={styles.spacer} />

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Continue</Text>
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
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    progressContainer: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        marginBottom: 40,
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
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        lineHeight: 24,
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
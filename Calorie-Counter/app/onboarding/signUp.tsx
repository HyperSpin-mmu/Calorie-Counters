import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Signup() {
    const router = useRouter();
    const { height, weight, age, sex, motivation, activity, bmi, calorieGoal } = useLocalSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // Added loading state to disable button and show spinner during async operations

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            // added check to ensure all fields are filled before attempting signup
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Create the Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // --- Macro Calculations (CHANGE: Applied consistent math logic) ---
            const w = Number(weight);
            const cals = Number(calorieGoal);

            
            let proteinPerKg = 1.6;
            if (motivation === "lose") proteinPerKg = 2.0;
            if (motivation === "gain") proteinPerKg = 1.8;
            const proteinGoal = Math.round(w * proteinPerKg);
            const proteinCalories = proteinGoal * 4;

            // Fat (g)
            const fatCalories = cals * 0.30;
            const fatGoal = Math.round(fatCalories / 9);

            // Carbs (g)
            const remainingCalories = cals - (proteinCalories + fatCalories);
            const carbGoal = Math.round(remainingCalories / 4);

            // Save onboarding data to Firestore
            await setDoc(
                doc(db, "users", uid),
                {
                    height,
                    weight,
                    age,
                    sex,
                    motivation,
                    activity,
                    bmi,
                    calorieGoal,
                    proteinGoal,
                    fatGoal,
                    carbGoal,
                    createdAt: new Date().toISOString(), // CHANGE: Added readable timestamp
                    updatedAt: Date.now(),
                },
                { merge: true }
            );

            // Navigate to main app
            router.replace("/(tabs)");
        } catch (err: any) {
            // Friendlier error messages for Firebase codes
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* CHANGE: Styled Back Button consistent with earlier flow */}
                    <TouchableOpacity
                        onPress={() => router.replace("/onboarding/BMI_Explanation")}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    

                    <View style={styles.header}>

                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Save your personalised plan and start tracking your progress.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="yourname@email.com"
                            placeholderTextColor="#9CA3AF"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Create a password"
                            placeholderTextColor="#9CA3AF"
                        />

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholder="Re-enter password"
                            placeholderTextColor="#9CA3AF"
                        />

                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/*  Branded primary button with loading indicator */}
                        <TouchableOpacity
                            style={[styles.primaryButton, loading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                        {/* NEW: added terms and privacy text under the button */}
                        <Text style={styles.termsText}>
                            By creating an account, you agree to our{" "}
                            <Text style={styles.link}>Terms</Text> and{" "}
                            <Text style={styles.link}>Privacy Policy</Text>.
                        </Text>

                    </View>
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
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    backButton: {
        paddingVertical: 12,
        marginTop: 10,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4B5563",
    },
    header: {
        marginTop: 20,
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
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 4,
        marginLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    input: {
        height: 56,
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#111827",
    },
    errorBox: {
        backgroundColor: "#FEF2F2",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FEE2E2",
        marginTop: 8,
    },
    errorText: {
        color: "#DC2626",
        fontSize: 14,
        textAlign: "center",
        fontWeight: "600",
    },
    primaryButton: {
        backgroundColor: "#16A34A",
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
        shadowColor: "#16A34A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
    termsText: {
        marginTop: 16,
        fontSize: 12,
        color: "#6B7280",
        textAlign: "center",
        paddingHorizontal: 10,
        lineHeight: 18,
    },
    link: {
        color: "#16A34A",
        fontWeight: "600",
    },
});
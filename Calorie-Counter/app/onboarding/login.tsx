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
    ActivityIndicator
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter your email and password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/(tabs)");
        } catch (err: any) {
            // CHANGE: British English error messaging
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError("Invalid email or password. Please try again.");
            } else {
                setError("Something went wrong. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.replace("/onboarding/splash")}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue your healthy journey.</Text>
                </View>

                <View style={styles.form}>
                    {/* Email Field */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="example@mail.com"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Password Field */}
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="••••••••"
                        placeholderTextColor="#9CA3AF"
                    />

                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* CHANGE: Signature green Primary Button with loading state */}
                    <TouchableOpacity
                        style={[styles.primaryButton, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer for new users */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/onboarding/motivation")}>
                            <Text style={styles.footerLink}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6FBF7",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
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
        marginTop: 40,
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
    },
    form: {
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
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
        marginBottom: 20, // CHANGE: Adjusted margin since forgot link is gone
    },
    errorBox: {
        backgroundColor: "#FEF2F2",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FEE2E2",
        marginBottom: 20,
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
        shadowColor: "#16A34A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: "#6B7280",
        fontSize: 15,
    },
    footerLink: {
        color: "#16A34A",
        fontWeight: "700",
        fontSize: 15,
    },
});
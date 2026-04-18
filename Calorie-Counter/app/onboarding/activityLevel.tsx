import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"; // added SafeAreaView
import { useLocalSearchParams, useRouter } from "expo-router";

// extracted levels into a constant for mapping and cleaner structure
const ACTIVITY_LEVELS = [
    {
        id: "inactive",
        title: "Inactive",
        description: "Fewer than 30 minutes a week",
        emoji: "🛋️", // added emoji for visual interest
    },
    {
        id: "active",
        title: "Active",
        description: "Between 30 and 150 minutes a week",
        emoji: "🚶",
    },
    {
        id: "very_active",
        title: "Very Active",
        description: "More than 150 minutes a week",
        emoji: "🏃",
    },
];

export default function ActivityLevelScreen() {
    const router = useRouter();
    const { motivation } = useLocalSearchParams();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    // renamed from selectedActivity to selectedId for consistency with motivation screen and clarity that it holds the id of the selected option

    const handleSelect = (id: string) => {
        setSelectedId(id);

        // slight delay to allow selection feedback before navigation
        setTimeout(() => {
            router.push({
                pathname: "/onboarding/BMI_Explanation",
                params: {
                    activity: id, // pass the selected activity level id
                    motivation: motivation,
                },
            });
        }, 200);
    };

    return (
        // replaced View with SafeAreaView
        <SafeAreaView style={styles.container}>
            {/* moved from inline absolute positioning to StyleSheet */}
            <TouchableOpacity
                onPress={() => router.replace("/onboarding/motivation")}
                style={styles.backButton}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/* added layout wrapper */}
            <View style={styles.content}>
                {/* added progress bar for onboarding step */}
                <View style={styles.progressContainer}>
                    {/* reflects step progress */}
                    <View style={[styles.progressBar, { width: "50%" }]} />
                </View>

                <Text style={styles.title}>How active are you?</Text>
                {/* updated subtitle */}
                <Text style={styles.subtitle}>
                    This helps us calculate your daily energy expenditure accurately.
                </Text>

                {/* replaced individual buttons with mapped cards */}
                <View style={styles.optionsContainer}>
                    {ACTIVITY_LEVELS.map((level) => {
                        const isSelected = selectedId === level.id;
                        return (
                            <TouchableOpacity
                                key={level.id}
                                activeOpacity={0.8}
                                onPress={() => handleSelect(level.id)}
                                style={[
                                    styles.optionCard,
                                    isSelected && styles.optionCardSelected,
                                ]}
                            >
                                {/* added emoji */}
                                <Text style={styles.emojiText}>{level.emoji}</Text>

                                {/* added text wrapper for title + description */}
                                <View style={styles.textColumn}>
                                    <Text
                                        style={[
                                            styles.optionTitle,
                                            isSelected && styles.optionTitleSelected,
                                        ]}
                                    >
                                        {level.title}
                                    </Text>
                                    <Text style={styles.optionDescription}>
                                        {level.description}
                                    </Text>
                                </View>

                                {/* added radio indicator styling */}
                                <View
                                    style={[
                                        styles.radioOuter,
                                        isSelected && styles.radioOuterSelected,
                                    ]}
                                >
                                    {/* inner selected dot */}
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6FBF7", // added background color
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginTop: 10, // replaced absolute positioning
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4B5563", // updated styling
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20, // new layout structure
    },
    progressContainer: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        marginBottom: 40,
        overflow: "hidden", // added progress bar
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#16A34A",
    },
    title: {
        fontSize: 28, // increased size
        fontWeight: "800", // stronger weight
        color: "#111827", // updated color
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280", // new subtitle styling
        marginBottom: 32,
        lineHeight: 22,
    },
    optionsContainer: {
        gap: 16, // replaced vertical margins between buttons
    },
    optionCard: {
        flexDirection: "row", // changed from centered button layout
        alignItems: "center",
        backgroundColor: "#FFFFFF", // replaced blue button
        padding: 18,
        borderRadius: 20, // increased radius
        borderWidth: 2,
        borderColor: "transparent",
        shadowColor: "#000", // added shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    optionCardSelected: {
        borderColor: "#16A34A", // selected state
        backgroundColor: "#F0FDF4",
    },
    textColumn: {
        flex: 1, // added wrapper for text alignment
    },
    emojiText: {
        fontSize: 24,
        marginRight: 16, // added spacing
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: "700", // stronger emphasis
        color: "#1F2937",
    },
    optionTitleSelected: {
        color: "#14532D", // selected text color
    },
    optionDescription: {
        fontSize: 14,
        color: "#6B7280", // added description text
        marginTop: 2,
    },
    radioOuter: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10, // added spacing from text
    },
    radioOuterSelected: {
        borderColor: "#16A34A",
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: "#16A34A",
    },
});
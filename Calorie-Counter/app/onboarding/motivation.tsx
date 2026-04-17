import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

// Define the motivation options with their corresponding labels and emojis
const MOTIVATION_OPTIONS = [
  { id: "lose", label: "Lose Weight", emoji: "📉" },
  { id: "maintain", label: "Maintain Weight", emoji: "⚖️" },
  { id: "gain", label: "Gain Weight", emoji: "📈" },
];

export default function MotivationScreen() {
  const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    // renamed from selectedMotivation to selectedId for clarity, as it holds the id of the selected option


  const handleSelect = (id: string) => {
      setSelectedId(id);

      // small delay to allow the UI to update and show the selected state before navigating to the next screen
    setTimeout(() => {
      router.push({
        pathname: "/onboarding/activityLevel",
        params: { motivation: id },
      });
    }, 200);
  };

  return (
      <SafeAreaView style={styles.container}>

      <TouchableOpacity
        onPress={() => router.replace("/onboarding/splash")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

          <View style={styles.content}>
              {/*  wrapper for consistent spacing and layout */}
              <View style={styles.progressContainer}>

                  {/* progress bar added to show onboarding progress */}
          <View style={[styles.progressBar, { width: "33%" }]} />
        </View>

        <Text style={styles.title}>What is your goal?</Text>
        <Text style={styles.subtitle}>
          This helps us personalise your daily calorie budget.
        </Text>

        <View style={styles.optionsContainer}>
          {MOTIVATION_OPTIONS.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                    activeOpacity={0.8} // added for better touch feedback
                onPress={() => handleSelect(option.id)}
                style={[
                  styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    // CONDITIONALLY APPLYING STYLES: If the option is selected, we apply the selected styles to change the appearance of the card and its contents
                ]}
              >
                    <Text style={styles.emojiText}>{option.emoji}</Text>

                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {/* SAFE LOGIC: Using ternary to ensure nothing is rendered if not selected */}
                  {isSelected ? <View style={styles.radioInner} /> : null}
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
        backgroundColor: "#F6FBF7"
    },


    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginTop: 10
    },

    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4B5563"
    },


    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20
    },


    progressContainer: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        marginBottom: 40,
        overflow: "hidden"
    },

    progressBar: {
        height: "100%",
        backgroundColor: "#16A34A"
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 8
    },


    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        marginBottom: 32,
        lineHeight: 22
    },


    optionsContainer: {
        gap: 16
    },


    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "transparent",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },

    optionCardSelected: {
        borderColor: "#16A34A",
        backgroundColor: "#F0FDF4"
    },
    emojiText: {
        fontSize: 24,
        marginRight: 16
    },

    optionLabel: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: "#374151"
    },
    optionLabelSelected: {
        color: "#14532D"
    },
    radioOuter: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2, 
        borderColor: "#D1D5DB",
        alignItems: "center",
        justifyContent: "center"
    },
    radioOuterSelected: {
        borderColor: "#16A34A"
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: "#16A34A"
    },
});
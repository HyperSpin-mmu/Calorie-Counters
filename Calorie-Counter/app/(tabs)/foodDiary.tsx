import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDiaryStore } from "../store/diaryStore";
import type { MealType } from "../types/food";

// These are the fixed meal sections used in the diary.
const MEAL_SECTIONS: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

// This screen shows the selected day's entries and the daily nutrition totals.
export default function FoodDiary() {
  const selectedDay = useDiaryStore((state) => state.selectedDay);
  const groupedEntries = useDiaryStore((state) =>
    state.getGroupedEntriesForSelectedDay()
  );
  const macroTotals = useDiaryStore((state) =>
    state.getMacroTotalsForSelectedDay()
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Food Diary</Text>
      <Text style={styles.dateText}>{selectedDay}</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <Text style={styles.summaryValue}>Calories: {macroTotals.calories}</Text>
        <Text style={styles.summaryValue}>Protein: {macroTotals.protein}g</Text>
        <Text style={styles.summaryValue}>Carbs: {macroTotals.carbs}g</Text>
        <Text style={styles.summaryValue}>Fat: {macroTotals.fat}g</Text>
      </View>

      {MEAL_SECTIONS.map((mealType) => {
        const entries = groupedEntries[mealType];

        return (
          <View key={mealType} style={styles.mealCard}>
            <Text style={styles.mealTitle}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Text>

            {entries.length === 0 ? (
              <Text style={styles.emptyText}>No entries logged for this meal.</Text>
            ) : (
              entries.map((entry) => (
                <View key={entry.id} style={styles.entryRow}>
                  <View style={styles.entryTextWrap}>
                    <Text style={styles.entryName}>{entry.name}</Text>
                    <Text style={styles.entryDetails}>
                      {entry.calories} kcal • {entry.protein}g protein • {entry.carbs}g carbs • {entry.fat}g fat
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "GoogleSans",
    marginBottom: 6,
    color: "#111111",
  },
  dateText: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: "GoogleSans",
    marginBottom: 10,
    color: "#111111",
  },
  summaryValue: {
    fontSize: 15,
    color: "#333333",
    marginBottom: 4,
  },
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 18,
    fontFamily: "GoogleSans",
    marginBottom: 12,
    color: "#111111",
  },
  emptyText: {
    fontSize: 14,
    color: "#777777",
  },
  entryRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  entryTextWrap: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    color: "#111111",
    marginBottom: 4,
  },
  entryDetails: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDiaryStore } from "../store/diaryStore";
import type { MealType } from "../types/food";
import {
  calculateMacroTotals,
  filterEntriesByDay,
  groupEntriesByMealType,
} from "../utils/diary";
import MacroRingChart from "../components/MacroRingChart";

// These are the fixed meal sections used in the diary.
const MEAL_SECTIONS: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

// This screen shows the selected day's entries and the daily nutrition totals.
export default function FoodDiary() {
  const selectedDay = useDiaryStore((state) => state.selectedDay);
  const entries = useDiaryStore((state) => state.entries);
  const removeEntry = useDiaryStore((state) => state.removeEntry);
  const setSelectedDay = useDiaryStore((state) => state.setSelectedDay);

  const selectedEntries = useMemo(() => {
    return filterEntriesByDay(entries, selectedDay);
  }, [entries, selectedDay]);

  const groupedEntries = useMemo(() => {
    return groupEntriesByMealType(selectedEntries);
  }, [selectedEntries]);

  const macroTotals = useMemo(() => {
    return calculateMacroTotals(selectedEntries);
  }, [selectedEntries]);

  // This moves the diary backwards or forwards by one day at a time
  const changeDay = (offset: number) => {
    const currentDate = new Date(`${selectedDay}T00:00:00`);
    currentDate.setDate(currentDate.getDate() + offset);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    setSelectedDay(`${year}-${month}-${day}`);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Food Diary</Text>
      <View style={styles.dateBar}>
        <TouchableOpacity style={styles.dateButton} onPress={() => changeDay(-1)}>
          <Text style={styles.dateButtonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>{selectedDay}</Text>

        <TouchableOpacity style={styles.dateButton} onPress={() => changeDay(1)}>
          <Text style={styles.dateButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <Text style={styles.summaryValue}>Calories: {macroTotals.calories}</Text>
        <Text style={styles.summaryValue}>Protein: {macroTotals.protein}g</Text>
        <Text style={styles.summaryValue}>Carbs: {macroTotals.carbs}g</Text>
        <Text style={styles.summaryValue}>Fat: {macroTotals.fat}g</Text>
        
        <View style={styles.chartWrap}>
          <MacroRingChart
            protein={macroTotals.protein}
            carbs={macroTotals.carbs}
            fat={macroTotals.fat}
          />
        </View>
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

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeEntry(entry.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
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
  dateBar: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 18,
  },
  dateText: {
    fontSize: 15,
    color: "#666666",
  },
  dateButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#EDEDED",
  },
  dateButtonText: {
    fontSize: 13,
    color: "#333333",
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
  chartWrap: {
  marginTop: 18,
  alignItems: "center",
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
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#EEEEEE",
  },
  entryTextWrap: {
    flex: 1,
  },
  removeButton: {
  marginLeft: 12,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
  backgroundColor: "#FDECEC",
  },
  removeButtonText: {
  fontSize: 13,
  color: "#C62828",
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
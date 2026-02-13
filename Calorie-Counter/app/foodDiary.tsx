import { Text, View, StyleSheet } from "react-native";

// This is the food diary screen, it is currently a placeholder and will be implemented later.
export default function FoodDiary() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diary</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "GoogleSans",
  }
});
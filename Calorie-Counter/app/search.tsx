import { Text, View, StyleSheet } from "react-native";

// This screen is for searching food items, it is currently a placeholder and will be implemented later.
export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Food</Text>
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
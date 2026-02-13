import { Text, View, StyleSheet } from "react-native";

// This is the main page of the app, it is the default screen that is shown when the app is opened.
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main page</Text>
    </View>
  );
}

// Styles for the main page, including the container and title text styles.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 24,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "GoogleSans",
  },
  title: {
    fontSize: 28,
    fontFamily: "GoogleSans",
    textAlign: "center",
  }
});

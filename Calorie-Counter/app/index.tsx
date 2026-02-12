import { Text, View, StyleSheet } from "react-native";

let dateTime = new Date();

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main page</Text>
    </View>
  );
}

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

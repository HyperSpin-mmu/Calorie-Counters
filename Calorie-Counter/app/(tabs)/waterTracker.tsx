import { Alert, Button, Text, View, StyleSheet, TextInput } from "react-native";

export default function WaterTracker() {
  const handlePress = () => {
    <View style={styles.container}>
      <TextInput></TextInput>
      <Button title="Enter" onPress={handlePress2} />
    </View>
  };

  const handlePress2 = () => {
    <View style={styles.container}>
      <Text style={styles.title}>Water Logged!</Text>
      <Button title="Back" />
    </View>
  }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Log</Text>
      <Button title="Log" onPress={handlePress} />
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
    //fontFamily: "GoogleSans",
  }
});
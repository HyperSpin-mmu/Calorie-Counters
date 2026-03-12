import { Button } from "@react-navigation/elements";
import { Text, View, StyleSheet } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Log</Text>
      <Button style={styles.button}>Log</Button>
    </View>
  );
}

export function WaterLog() {
    return (
        <View style={styles.container}>
            <Input style={styles.input}></Input>
            <Button style={styles.button}>Submit</Button>
        </View>
    );
}

export function OutputMessage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Water Logged!</Text>
            <Button style={styles.button}>Back</Button>
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
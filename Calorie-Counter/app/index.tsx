import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>I am testing the app!</Text>
      <Text>This is the main screen of the Calorie Counter app.</Text>
    </View>
  );
}

import React from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

type Item = {
  id: number;
  title: string;
};

const data: Item[] = [
  { id: 1, title: "Slide 1" },
  { id: 2, title: "Slide 2" },
  { id: 3, title: "Slide 3" },
];

export default function Splash() {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});

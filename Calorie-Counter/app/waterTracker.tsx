import { View, Text, StyleSheet } from 'react-native';

export default function WaterTracker() {
  return (
    <View style={styles.container}>
      <Text>Water Tracker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
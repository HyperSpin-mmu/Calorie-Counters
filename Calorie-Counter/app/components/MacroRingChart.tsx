import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type MacroRingChartProps = {
  protein: number;
  carbs: number;
  fat: number;
};

// This chart shows the macro split for the day as a ring.
export default function MacroRingChart({
  protein,
  carbs,
  fat,
}: MacroRingChartProps) {
  const size = 180;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = protein + carbs + fat;

  const proteinValue = total > 0 ? protein : 0;
  const carbsValue = total > 0 ? carbs : 0;
  const fatValue = total > 0 ? fat : 0;

  const proteinLength =
    total > 0 ? (proteinValue / total) * circumference : 0;
  const carbsLength =
    total > 0 ? (carbsValue / total) * circumference : 0;
  const fatLength = total > 0 ? (fatValue / total) * circumference : 0;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EAEAEA"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4CAF50"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${proteinLength} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="butt"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2196F3"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${carbsLength} ${circumference}`}
          strokeDashoffset={-proteinLength}
          strokeLinecap="butt"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FF9800"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${fatLength} ${circumference}`}
          strokeDashoffset={-(proteinLength + carbsLength)}
          strokeLinecap="butt"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.centreLabel}>
        <Text style={styles.centreTitle}>Macros</Text>
        <Text style={styles.centreValue}>{total}g</Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.legendText}>Protein: {protein}g</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#2196F3" }]} />
          <Text style={styles.legendText}>Carbs: {carbs}g</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#FF9800" }]} />
          <Text style={styles.legendText}>Fat: {fat}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  centreLabel: {
    position: "absolute",
    top: 62,
    alignItems: "center",
  },
  centreTitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  centreValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111111",
  },
  legend: {
    marginTop: 16,
    width: "100%",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#333333",
  },
});
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  product_name?: string;
  brands?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    carbohydrates_100g?: number;
    proteins_100g?: number;
    fat_100g?: number;
  };
};

type ManualProduct = {
  name: string;
  brand: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
};

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manual, setManual] = useState<ManualProduct>({
    name: "", brand: "", calories: "", carbs: "", protein: "", fat: "",
  });
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.trim().length < 3) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        Animated.timing(fadeAnim, { toValue: 0.4, duration: 150, useNativeDriver: true }).start();

        const response = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
            debouncedSearch
          )}&search_simple=1&json=true&page_size=20&fields=product_name,brands,nutriments`
        );
        const data = await response.json();

        const term = debouncedSearch.toLowerCase().trim();
        // FIX 1: Split into words and require ALL words to appear somewhere in
        // the product name — instead of requiring the full phrase verbatim.
        // This matches how OpenFoodFacts actually indexes products.
        const words = term.split(/\s+/).filter(Boolean);

        const filtered = (data.products || []).filter((p: Product) => {
          const name = p.product_name?.toLowerCase() || "";
          // Every search word must appear somewhere in the name
          return words.every((word) => name.includes(word));
        })
          // Sort: exact matches first, then starts-with, then contains
          .sort((a: Product, b: Product) => {
            const an = a.product_name?.toLowerCase() ?? "";
            const bn = b.product_name?.toLowerCase() ?? "";
            if (an === term) return -1;
            if (bn === term) return 1;
            if (an.startsWith(term) && !bn.startsWith(term)) return -1;
            if (bn.startsWith(term) && !an.startsWith(term)) return 1;
            return 0;
          });

        setProducts(filtered);
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch]);

  const handleProductPress = (item: Product) => {
    router.push({
      pathname: "/foodAmount",
      params: {
        manualProduct: JSON.stringify({
          name: item.product_name,
          brand: item.brands || "Unknown brand",
          calories: item.nutriments?.["energy-kcal_100g"] ?? 0,
          carbs: item.nutriments?.carbohydrates_100g ?? 0,
          protein: item.nutriments?.proteins_100g ?? 0,
          fat: item.nutriments?.fat_100g ?? 0,
        }),
      },
    });
  };

  const handleManualSubmit = () => {
    if (!manual.name || !manual.calories) return;
    router.push({
      pathname: "/foodAmount",
      params: {
        manualProduct: JSON.stringify({
          name: manual.name,
          brand: manual.brand || "Manual entry",
          calories: parseFloat(manual.calories) || 0,
          carbs: parseFloat(manual.carbs) || 0,
          protein: parseFloat(manual.protein) || 0,
          fat: parseFloat(manual.fat) || 0,
        }),
      },
    });
    setShowManualModal(false);
    setManual({ name: "", brand: "", calories: "", carbs: "", protein: "", fat: "" });
  };

  const MacroBadge = ({
    value,
    label,
    color,
  }: {
    value: number;
    label: string;
    color: string;
  }) => (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeValue}>{Math.round(value)}g</Text>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Food</Text>
      </View>

      {/* Search Bar + Add Button */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search food (min 3 letters)..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginLeft: 8 }} />
          ) : search.length > 0 ? (
            <TouchableOpacity onPress={() => { setSearch(""); setProducts([]); }}>
              <MaterialIcons name="close" size={18} color="#aaa" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowManualModal(true)}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={products}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const kcal = Math.round(item.nutriments?.["energy-kcal_100g"] ?? 0);
            const carbs = item.nutriments?.carbohydrates_100g ?? 0;
            const protein = item.nutriments?.proteins_100g ?? 0;
            const fat = item.nutriments?.fat_100g ?? 0;
            return (
              <Pressable
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => handleProductPress(item)}
              >
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {item.product_name}
                    </Text>
                    <Text style={styles.cardBrand} numberOfLines={1}>
                      {item.brands || "Unknown brand"}
                    </Text>
                  </View>
                  <View style={styles.kcalBadge}>
                    <Text style={styles.kcalValue}>{kcal}</Text>
                    <Text style={styles.kcalLabel}>kcal</Text>
                  </View>
                </View>
                <View style={styles.macroRow}>
                  <MacroBadge value={carbs} label="Carbs" color="#E3F2FD" />
                  <MacroBadge value={protein} label="Protein" color="#E8F5E9" />
                  <MacroBadge value={fat} label="Fat" color="#FFF3E0" />
                  <Text style={styles.perNote}>per 100g</Text>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            !loading && debouncedSearch.length >= 3 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="search-off" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No results found</Text>
                <TouchableOpacity
                  style={styles.manualFallbackBtn}
                  onPress={() => setShowManualModal(true)}
                >
                  <Text style={styles.manualFallbackText}>Add manually instead</Text>
                </TouchableOpacity>
              </View>
            ) : !loading && debouncedSearch.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="restaurant" size={48} color="#ccc" />
                <Text style={styles.emptyText}>Search for a food to get started</Text>
              </View>
            ) : null
          }
        />
      </Animated.View>

      {/* Manual Add Modal */}
      <Modal visible={showManualModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food Manually</Text>
              <TouchableOpacity onPress={() => setShowManualModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {/* FIX 2: Use "always" so taps inside the modal never dismiss the
                keyboard, which was causing TextInput fields to lose focus
                immediately after being tapped on Android. */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              {[
                { key: "name", label: "Product Name *", placeholder: "e.g. Greek Yogurt", keyboard: "default" },
                { key: "brand", label: "Brand", placeholder: "e.g. Fage", keyboard: "default" },
                { key: "calories", label: "Calories (kcal) *", placeholder: "e.g. 250", keyboard: "numeric" },
                { key: "carbs", label: "Carbs (g)", placeholder: "e.g. 30", keyboard: "numeric" },
                { key: "protein", label: "Protein (g)", placeholder: "e.g. 20", keyboard: "numeric" },
                { key: "fat", label: "Fat (g)", placeholder: "e.g. 5", keyboard: "numeric" },
              ].map(({ key, label, placeholder, keyboard }) => (
                <View key={key} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder={placeholder}
                    placeholderTextColor="#bbb"
                    keyboardType={keyboard as any}
                    value={(manual as any)[key]}
                    onChangeText={(val) =>
                      setManual((prev) => ({ ...prev, [key]: val }))
                    }
                    // Prevent the field from losing focus when the modal shifts
                    blurOnSubmit={false}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!manual.name || !manual.calories) && styles.submitBtnDisabled,
                ]}
                onPress={handleManualSubmit}
                disabled={!manual.name || !manual.calories}
              >
                <Text style={styles.submitBtnText}>Continue to Add →</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111" },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },

  list: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: { backgroundColor: "#f0f0f0", transform: [{ scale: 0.98 }] },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardName: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 3 },
  cardBrand: { fontSize: 13, color: "#888" },
  kcalBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    marginLeft: 10,
  },
  kcalValue: { fontSize: 18, fontWeight: "800", color: "#fff" },
  kcalLabel: { fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: -2 },
  macroRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  badgeValue: { fontSize: 13, fontWeight: "700", color: "#333" },
  badgeLabel: { fontSize: 10, color: "#666", marginTop: 1 },
  perNote: { marginLeft: "auto", fontSize: 11, color: "#bbb", fontStyle: "italic" },

  emptyState: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: "#bbb" },
  manualFallbackBtn: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  manualFallbackText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6 },
  fieldInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: { backgroundColor: "#ccc" },
  submitBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
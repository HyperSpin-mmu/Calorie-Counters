import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function SearchScreen() {

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<Array<{ product_name?: string; brands?: string }>>([]);


  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (search.trim().length < 3) {
      setProducts([]);
      return;
    }


    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${search}&search_simple=1&json=true`
        );

        const data = await response.json();

        setProducts(data.products || []);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search]);

  return (
    <View style={styles.container}>
      {/* SEARCH INPUT */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search food (min 3 letters)..."
        value={search}
        onChangeText={setSearch}
      />

      {/* LOADING SPINNER */}
      {loading && <ActivityIndicator size="large" />}

      {/* RESULTS LIST */}
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>
              {item.product_name || "No name available"}
            </Text>
            <Text style={styles.subtitle}>
              {item.brands || "Unknown brand"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          !loading && search.length >= 3 ? (
            <Text style={styles.noResults}>No results found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  item: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});
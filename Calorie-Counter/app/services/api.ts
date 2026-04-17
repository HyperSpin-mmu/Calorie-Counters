export async function fetchFoodData(barcode: string) {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
      headers: { 'User-Agent': 'CalorieCounterApp/1.0 (23761571@stu.mmu.ac.uk)' }
    });
    const data = await response.json();

    if (data.status === 1) {
      const product = data.product;
      const n = product.nutriments || {};
      const brandString = product.brands || "Unknown Brand";
      const primaryBrand = brandString.split(',')[0].trim();

      // Prefer per-serving values, fall back to per-100g
      const calories = n['energy-kcal_serving'] ?? n['energy-kcal_100g'] ?? n['energy-kcal'] ?? "N/A";
      const carbs    = n['carbohydrates_serving'] ?? n['carbohydrates_100g'] ?? n['carbohydrates'] ?? "N/A";
      const protein  = n['proteins_serving']      ?? n['proteins_100g']      ?? n['proteins']      ?? "N/A";
      const fat      = n['fat_serving']           ?? n['fat_100g']           ?? n['fat']           ?? "N/A";

      // Detect whether values are per-serving or per-100g for the unit toggle default
      const isPerServing = n['energy-kcal_serving'] != null;

      return {
        name: product.product_name || "Unknown Product",
        brand: primaryBrand,
        calories,
        carbs,
        protein,
        fat,
        isPerServing, // pass this to foodAmount.tsx
        servingSize: product.serving_size || null,
      };
    } else {
      return { name: "Product not found", brand: "N/A", calories: "N/A", carbs: "N/A", protein: "N/A", fat: "N/A", isPerServing: false, servingSize: null };
    }
  } catch (error) {
    console.error("Error fetching food data:", error);
    throw error;
  }
}
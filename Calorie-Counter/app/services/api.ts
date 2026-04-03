// This module provides a function to fetch food data from the OpenFoodFacts API based on a scanned barcode.

export async function fetchFoodData(barcode: string) {
  try {
    // Fetch product data from the OpenFoodFacts API using the scanned barcode.
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
      headers: {
        'User-Agent': 'CalorieCounterApp/1.0 (23761571@stu.mmu.ac.uk)'
      }
    });

    // Wait for response. 
    const data = await response.json();

    // Check if the product was found and extract relevant information, including handling cases where certain data may be missing.
    if (data.status === 1) {
      const product = data.product;
      const nutrients = product.nutriments || {};

      const brandString = product.brands || "Unknown Brand";
      const primaryBrand = brandString.split(',')[0].trim();

      return {
        // Product information is retrieved from the API response, with fallbacks to handle missing data.
        name: product.product_name || "Unknown Product",
        brand: primaryBrand,
        calories: 
          nutrients['energy-kcal'] || 
          nutrients.energy_kcal || "N/A",
        carbs: nutrients.carbohydrates ?? "N/A",
        protein: nutrients.proteins ?? "N/A",
        fat: nutrients.fat ?? "N/A",
      };
    } else {
      return {
        // If the product is not found, we return a default object with "N/A" values to indicate that the information is unavailable.
        name: "Product not found",
        brand: "N/A",
        calories: "N/A",
        carbs: "N/A",
        protein: "N/A",
        fat: "N/A",
      };
    }
  } catch (error) {
    // Log any errors that occur during the fetch operation for debugging purposes, and rethrow the error to be handled by the calling function.
    console.error("Error fetching food data:", error);
    throw error;
  }
}
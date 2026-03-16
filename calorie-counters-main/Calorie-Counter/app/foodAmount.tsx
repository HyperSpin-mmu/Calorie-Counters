import { useLocalSearchParams, useRouter } from "expo-router";
import { use, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, Platform } from "react-native";
import { useState } from "react";
import { navigate } from "expo-router/build/global-state/routing";




export default function foodAmountScreen() {

  const scannedData = useLocalSearchParams();
  const [kcal, setKcal] = useState<number | null>(null); // store calculated kcal
  const router = useRouter();

  

  useEffect(() => {console.log("Received scanned data:", scannedData);

    if (!scannedData.scannedData) return;

    const url = `https://world.openfoodfacts.net/api/v2/product/${scannedData.scannedData}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {

        const energyKj = data.product.nutriments['energy'];

        if (energyKj) {
          const calculatedKcal = Math.round(energyKj / 4.184);
          setKcal(calculatedKcal);
        }

      })
      .catch(error => {
        console.log("API Error:", error);
      });

  }, [scannedData]);

const successMessage = 'Item successfully added to your calorie count!';

  function showAlert(successMessage: string) {
  if (Platform.OS === 'web') {
    window.alert(successMessage);
  } else {
    Alert.alert(successMessage);
  }
}

const handleRedirect = () => {
        navigate('/'); 
      };
  
      return (
    <View style={styles.container}>
      <Text style={styles.title}>Kurt I know you're jealous</Text>
      <Text style={styles.message}>Last Scanned: {scannedData.scannedData}</Text>
      <Text style={styles.message}>Calories: {kcal} kcal</Text>
      <Button
          title="Add Product"
          onPress={() => {
            showAlert(successMessage);
              router.replace({
                pathname: "/",
                params: { kcal: String(kcal), t: Date.now().toString() }
                });
;
          }}
        />  
      
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
  },
    message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'black',
  },
});



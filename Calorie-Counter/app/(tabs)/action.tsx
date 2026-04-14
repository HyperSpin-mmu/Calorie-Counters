// This is the barcode scanner screen, it uses the expo-camera library to access the camera and scan barcodes.
import { useCameraPermissions, CameraView, BarcodeScanningResult, scanFromURLAsync } from 'expo-camera';
import { useCallback, useRef } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWaterStore } from '../store/waterStore';

export default function BarcodeScanner() {

  // State to manage camera permissions and scanning status.
  const [permission, requestPermission] = useCameraPermissions();
  const isScanning = useRef(false);
  const router = useRouter();

  // Reset scanning status when the screen is focused to allow scanning again.
  useFocusEffect(
    useCallback(() => {
      isScanning.current = false;
    }, [])
  );

  // Handle the barcode scanning result, navigate to the food amount screen with the scanned data.
  const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (isScanning.current) return;
    isScanning.current = true;

    // Log the scanned barcode data for debugging purposes.
    console.log(`Scanned barcode with type ${type} and data ${data}`);

    // Navigate to the food amount screen and pass the scanned data as a parameter.
    router.replace({
      pathname: '/foodAmount',
      params: { scannedData: data }
    });
  };

  // If the permission state is still loading, we return an empty view to avoid rendering the camera.
  if (!permission) return <View />;

  // If the permission is not granted, we show a message and a button to request permission.
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera permission</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }
  // If the permission is granted, we render the camera view and set up the barcode scanning handler.
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          
          <TouchableOpacity 
          // Back button to navigate back to the previous screen.
            style={styles.backButton} 
            onPress={() => router.replace('/')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
  
          <Text style={styles.headerTitle}>Scan Barcode</Text>
          
        </View>
      </SafeAreaView>

      <CameraView
      // Set up the camera view with the barcode scanning handler and configure it to scan EAN-8 and EAN-13 barcodes. 
        onBarcodeScanned={handleBarcodeScanned}
        style={styles.camera} 
        facing={'back'}
        barcodeScannerSettings={{ barcodeTypes: ["ean8", "ean13"] }}
      />

      {/* Overlay moved OUTSIDE CameraView */}
      <View style={styles.overlay}>
        <View style={styles.scannerFrame} />
      </View>

    </View>
  );
}

// Styles for the barcode scanner screen, including the camera view, header, and overlay for the scanning frame.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15, 
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "black",
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  overlay : {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 320,
    height: 250,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 30,
    borderStyle: 'solid',
  }
});

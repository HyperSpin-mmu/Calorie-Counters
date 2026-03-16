import { useCameraPermissions, CameraView, BarcodeScanningResult, scanFromURLAsync } from 'expo-camera';
import { useCallback, useRef } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const isScanning = useRef(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      isScanning.current = false;
    }, [])
  );

  const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (isScanning.current) return;
    isScanning.current = true;

    console.log(`Scanned barcode with type ${type} and data ${data}`);

    router.replace({
      pathname: '/foodAmount',
      params: { scannedData: data }
    });
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera permission</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          
          <TouchableOpacity 
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
        onBarcodeScanned={handleBarcodeScanned}
        style={styles.camera} 
        facing={'back'}
        barcodeScannerSettings={{ barcodeTypes: ["ean8", "ean13"] }}
      >

        <View style={styles.overlay}>
          <View style={styles.scannerFrame} />
        </View>
      </CameraView>
    </View>
  );
}

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
    flex: 1,
    backgroundColor: "transparent",
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
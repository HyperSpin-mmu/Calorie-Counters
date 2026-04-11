// Import the function that lets us connect to a Firebase project
import { initializeApp } from "firebase/app";

// Import the function that gives us access to Firebase Authentication
import { getAuth } from "firebase/auth";

// Import Firestore
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC9zrUTxwrLs_y3xPZISSwwk_jXYbkljI0",
  authDomain: "calorie-counters-a5bd2.firebaseapp.com",
  projectId: "calorie-counters-a5bd2",
  storageBucket: "calorie-counters-a5bd2.firebasestorage.app",
  messagingSenderId: "539677166471",
  appId: "1:539677166471:web:3bef50d0ecba8351d9a122",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);

// Export Firestore
export const db = getFirestore(app);

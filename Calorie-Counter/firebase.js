//Import the function that lets us connect to a Firebase project
import { initializeApp } from "firebase/app";

// Import the function that gives us access to Firebase Authentication
import { getAuth } from "firebase/auth";

// This object contains all the secret details for YOUR Firebase project.
//obtained from the Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyC9zrUTxwrLs_y3xPZISSwwk_jXYbkljI0",
  authDomain: "calorie-counters-a5bd2.firebaseapp.com",
  projectId: "calorie-counters-a5bd2",
  storageBucket: "calorie-counters-a5bd2.firebasestorage.app",
  messagingSenderId: "539677166471",
  appId: "1:539677166471:web:3bef50d0ecba8351d9a122",
};

// This actually starts (initializes) your Firebase app using the config above.
// like "connecting" your app to Firebase.
const app = initializeApp(firebaseConfig);

// This gives you the Firebase Authentication service for your app.
//progtam will use this to log in, log out, create users, etc.
export const auth = getAuth(app);

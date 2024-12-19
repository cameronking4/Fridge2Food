import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { getStorage } from "firebase/storage";

const firebaseConfig ={
  "apiKey": "YOUR_API_KEY_HERE",
  "authDomain": "YOUR_AUTH_DOMAIN_HERE",
  "projectId": "YOUR_PROJECT_ID_HERE",
  "storageBucket": "YOUR_STORAGE_BUCKET_HERE",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID_HERE",
  "appId": "YOUR_APP_ID_HERE",
  "measurementId": "YOUR_MEASUREMENT_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Get Firebase Storage reference
const storage = getStorage(app);

export { db, auth, storage };

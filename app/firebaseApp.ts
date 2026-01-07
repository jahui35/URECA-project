// src/firebaseApp.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjTFG9kD2X2WTMf7opShTxaIbiolS-JcY",
  authDomain: "jiahuiureca.firebaseapp.com",
  projectId: "jiahuiureca",
  storageBucket: "jiahuiureca.firebasestorage.app",
  messagingSenderId: "120828304024",
  appId: "1:120828304024:web:81b27fb1a7acf558abceed"
};

// Initialize ONCE, at import time
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
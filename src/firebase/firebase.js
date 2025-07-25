import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDe3ZhH9qfMIg5OvB48v5wKtDj3CT3PGbc",
  authDomain: "kfc-zamowienia.firebaseapp.com",
  projectId: "kfc-zamowienia",
  storageBucket: "kfc-zamowienia.firebasestorage.app",
  messagingSenderId: "171004001355",
  appId: "1:171004001355:web:c9a3b8b8e147eee9c1e1ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Explicit exports
export { db, auth };
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDe3ZhH9qfMIg5OvB48v5wKtDj3CT3PGbc",
  authDomain: "kfc-zamowienia.firebaseapp.com",
  projectId: "kfc-zamowienia",
  storageBucket: "kfc-zamowienia.firebasestorage.app",
  messagingSenderId: "171004001355",
  appId: "1:171004001355:web:c9a3b8b8e147eee9c1e1ce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

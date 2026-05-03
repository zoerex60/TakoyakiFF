import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBJyJbrw6VIhYA55sFkYXK5_-8epa6OuDk",
  authDomain: "takoyaki-ff.firebaseapp.com",
  databaseURL: "https://takoyaki-ff-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "takoyaki-ff",
  storageBucket: "takoyaki-ff.firebasestorage.app",
  messagingSenderId: "886736965927",
  appId: "1:886736965927:web:62161ee34a2775196c5902",
  measurementId: "G-MGP7XP1QRR",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

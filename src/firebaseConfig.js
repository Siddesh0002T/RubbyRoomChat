// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv35o4Ymb-poEMjc1tNZ4HFC_Ty6hAZfs",
  authDomain: "rubbyroomchat.firebaseapp.com",
  projectId: "rubbyroomchat",
  storageBucket: "rubbyroomchat.appspot.com",
  messagingSenderId: "779342880819",
  appId: "1:779342880819:web:7b0730af502f4d7bc58346",
  measurementId: "G-ZVW29BM3QS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with robust local offline caching for low-speed/offline support
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  console.warn("Firestore offline persistence initialization fallback:", e);
  const { getFirestore } = require('firebase/firestore');
  db = getFirestore(app);
}

export { db };

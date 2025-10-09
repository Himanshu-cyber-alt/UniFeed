// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD69QpLG9u1IbLiCakKYB_S9J9oFPOOrsU",
  authDomain: "unifeed-85129.firebaseapp.com",
  projectId: "unifeed-85129",
  storageBucket: "unifeed-85129.appspot.com",
  messagingSenderId: "810973618587",
  appId: "1:810973618587:web:43f988f4ae7d079ef6c13e",
  measurementId: "G-19MMBMXCFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default app;


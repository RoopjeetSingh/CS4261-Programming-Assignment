// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz8CtR24o638d7PZkznvf5r7TP0u0ccVY",
  authDomain: "movie-voting-app-663bb.firebaseapp.com",
  projectId: "movie-voting-app-663bb",
  storageBucket: "movie-voting-app-663bb.firebasestorage.app",
  messagingSenderId: "1045378493192",
  appId: "1:1045378493192:web:5da3b2d8c4f7763e015abd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
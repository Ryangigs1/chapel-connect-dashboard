// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBrq_4i9iL2un0L-aSyj8ylCoJ5E-rBYBk",
  authDomain: "my-chapel-app.firebaseapp.com",
  projectId: "my-chapel-app",
  storageBucket: "my-chapel-app.firebasestorage.app",
  messagingSenderId: "797146516177",
  appId: "1:797146516177:web:70983a5317befbf3f253f0",
  measurementId: "G-W47B9G137P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
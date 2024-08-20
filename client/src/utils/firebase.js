// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "ticketmanagement-66699.firebaseapp.com",
  projectId: "ticketmanagement-66699",
  storageBucket: "ticketmanagement-66699.appspot.com",
  messagingSenderId: "782538900867",
  appId: "1:782538900867:web:cd819d3da00548d88c62b6",
  measurementId: "G-40REJGGCHB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
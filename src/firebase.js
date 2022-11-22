// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQP5u-gvCZ4-wBm_oAjbVtWUuUU9g34m8",
  authDomain: "apex-api-app.firebaseapp.com",
  projectId: "apex-api-app",
  storageBucket: "apex-api-app.appspot.com",
  messagingSenderId: "356919268061",
  appId: "1:356919268061:web:32999f948cb3f08adcc134",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
const db = getFirestore(app);
export const auth = getAuth(app);
export default db;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOQMIcbvzRMaklB0kJEkbg3nCL5enMK7Q",
  authDomain: "inventory-management-168c8.firebaseapp.com",
  projectId: "inventory-management-168c8",
  storageBucket: "inventory-management-168c8.appspot.com",
  messagingSenderId: "131442779092",
  appId: "1:131442779092:web:b417115ecf0317e766ec41",
  measurementId: "G-LPGF0CHG4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
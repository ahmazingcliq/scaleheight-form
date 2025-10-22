// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"
 
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAOMmvgmrJXbjPcxaeOZy_i3WjrFwMUwak",
    authDomain: "scaleheight-form.firebaseapp.com",
    projectId: "scaleheight-form",
    storageBucket: "scaleheight-form.firebasestorage.app",
    messagingSenderId: "279560737813",
    appId: "1:279560737813:web:b6e2358d48982df23bea1c",
    measurementId: "G-P1FG90C7DD"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

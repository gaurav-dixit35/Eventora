// firebase/config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBB_ugZ409_0r0Gh4ahMWB8VwS2LTT9mXs",
  authDomain: "eventora-f7d31.firebaseapp.com",
  projectId: "eventora-f7d31",
  storageBucket: "eventora-f7d31.appspot.com",
  messagingSenderId: "736502367341",
  appId: "1:736502367341:web:e198ccd4df22417cebab64",
  measurementId: "G-3TZ2PYCJ5D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

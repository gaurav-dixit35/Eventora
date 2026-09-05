import { auth } from "../firebase/config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const switchFormBtn = document.getElementById("switchForm");

// Show login by default
signupForm.style.display = "none";

// Switch between forms
switchFormBtn.addEventListener("click", () => {
  if (signupForm.style.display === "none") {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  } else {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }
});

// --- SIGNUP FORM LOGIC ---
signupForm.addEventListener("form-valid", async (e) => {
  const { username, email, password } = e.detail;
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // Save username to localStorage
    localStorage.setItem("eventoraUsername", username);

    alert("Signup successful! Please login.");

    // Reset form and switch to login
    signupForm.reset();
    switchFormBtn.click();

  } catch (err) {
    alert("Signup Error: " + err.message);
  }
});

// --- LOGIN FORM LOGIC ---
loginForm.addEventListener("form-valid", async (e) => {
  const { email, password } = e.detail;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    const username = localStorage.getItem("eventoraUsername") || "User";
    alert(`Welcome, ${username}!`);

      window.location.href = "index.html";

  } catch (err) {
    if (err.code === "auth/user-not-found") {
      alert("User not found. Please sign up.");
    } else if (err.code === "auth/wrong-password") {
      alert("Incorrect password. Try again.");
    } else {
      alert("Login Error: " + err.message);
    }
  }
});

import { auth } from "../firebase/config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

const userHex = document.getElementById('userHex');
const logoutBtn = document.getElementById('logoutBtn');
const premiumBtn = document.getElementById('premiumBtn');
const premiumPopup = document.getElementById('premiumPopup');

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const username = localStorage.getItem("eventoraUsername") || "User";
    userHex.textContent = username.charAt(0).toUpperCase();
    userHex.title = username;
    logoutBtn.classList.remove("hidden");
  } else {
    alert("You must login first.");
    window.location.href = "../index.html";
  }
});

// Logout logic
userHex.addEventListener("click", () => {
  logoutBtn.classList.toggle("hidden");
});
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("eventoraUsername");
    alert("Logged out!");
    window.location.href = "../index.html";
  });
});

// Premium popup
premiumBtn.addEventListener("click", () => {
  premiumPopup.classList.toggle("hidden");
});

// Buy button effect
document.querySelectorAll(".buy").forEach(btn => {
  btn.addEventListener("click", () => {
    premiumPopup.classList.add("hidden");
    document.querySelectorAll("button, input").forEach(el => {
      el.style.boxShadow = "0 0 15px gold";
    });
  });
});

// Cookie consent
document.addEventListener("DOMContentLoaded", () => {
  const cookieBtn = document.getElementById("acceptCookies");
  const cookieBox = document.getElementById("cookieBox");

  if (cookieBtn && cookieBox) {
    cookieBtn.addEventListener("click", () => {
      cookieBox.style.display = "none";
    });
  }
});


// Theme Toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  themeToggle.textContent = next === "light" ? "light_mode" : "dark_mode";
});

// Redirect on click
window.openEvent = function (id) {
  alert("Opening event page for event #" + id);
};

// home.js

// AOS init
AOS.init({
  duration: 800,
  once: true,
});

// GSAP hero animation
window.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const navLinks = document.querySelectorAll(".hero-nav a");

  if (hero) {
    gsap.from(hero, {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power2.out"
    });
  }

  if (navLinks.length > 0) {
    gsap.from(navLinks, {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      delay: 0.5,
      ease: "power1.out"
    });
  }
});
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.querySelector('.theme-toggle');
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  icon.innerText = isDark ? "dark_mode" : "light_mode";
}

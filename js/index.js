// AOS init
AOS.init();

// LOGOUT TOGGLE
const avatar = document.querySelector(".avatar-hex");
const logout = document.querySelector(".logout");

if (avatar && logout) {
  avatar.addEventListener("click", () => {
    logout.classList.toggle("show");
  });

  logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

// THEME TOGGLE (if you have a switch)
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute(
      "data-theme",
      currentTheme === "dark" ? "light" : "dark"
    );
  });
}

// PREMIUM MODAL LOGIC
const premiumBtn = document.getElementById("premiumBtn");
const premiumModal = document.getElementById("premiumModal");

if (premiumBtn && premiumModal) {
  premiumBtn.addEventListener("click", () => {
    premiumModal.style.display = "flex";
  });

  premiumModal.addEventListener("click", (e) => {
    if (e.target === premiumModal) {
      premiumModal.style.display = "none";
    }
  });
}

document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.toggle);
    input.type = input.type === "password" ? "text" : "password";
  });
});

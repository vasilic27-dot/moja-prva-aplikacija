"use strict";

// Učitavanje pre stilova sprečava bljesak svetle teme pri ponovnom otvaranju.
(() => {
  const key = "moji-zadaci-tema-v1";
  let theme = "light";
  try {
    const saved = localStorage.getItem(key);
    if (saved === "dark" || saved === "light") theme = saved;
  } catch { /* Aplikacija ostaje dostupna i kada je skladište blokirano. */ }
  document.documentElement.dataset.theme = theme;

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("#theme-toggle");
    const message = document.querySelector("#theme-status");
    function updateButton() {
      const dark = theme === "dark";
      button.textContent = dark ? "Svetla tema" : "Tamna tema";
      button.setAttribute("aria-label", dark ? "Prebaci na svetlu temu" : "Prebaci na tamnu temu");
      button.setAttribute("aria-pressed", String(dark));
    }
    button.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      updateButton();
      try {
        localStorage.setItem(key, theme);
        message.textContent = "";
      } catch {
        message.textContent = "Izbor teme nije sačuvan jer browser ne dozvoljava lokalno čuvanje.";
      }
    });
    updateButton();
  });
})();

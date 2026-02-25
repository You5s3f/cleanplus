/* =========================================================
   Clean Plus — AUTH (JS)
   - Toggle password
   - Loading state on submit (login + logout) WITHOUT blocking submit
   ========================================================= */

(function () {
  "use strict";

  // Toggle password
  const toggle = document.getElementById("togglePwd");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const input =
        document.getElementById("id_password") ||
        document.querySelector('input[name="password"]');

      if (!input) return;

      const isPwd = input.type === "password";
      input.type = isPwd ? "text" : "password";

      toggle.innerHTML = isPwd
        ? '<i class="fas fa-eye-slash"></i>'
        : '<i class="fas fa-eye"></i>';
    });
  }

  // Login loading (submit)
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  if (loginForm && loginBtn) {
    const first = loginForm.querySelector("input");
    if (first) setTimeout(() => first.focus(), 150);

    loginForm.addEventListener("submit", () => {
      // laisse le submit se faire, puis affiche loading
      requestAnimationFrame(() => {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
      });
    });
  }

  // Logout loading (submit) ✅ FIX
  const logoutForm = document.getElementById("logoutForm");
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutForm && logoutBtn) {
    logoutForm.addEventListener("submit", () => {
      // Important : ne pas désactiver AVANT le submit
      requestAnimationFrame(() => {
        logoutBtn.disabled = true;
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Déconnexion...';
      });
    });
  }
})();

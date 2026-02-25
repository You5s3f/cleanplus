/* =========================================================
   Clean Plus Admin — DEMANDES FORM (JS)
   - Focus first field
   - Loading state on submit
   - Auto add basic classes to Django widgets (safe)
   ========================================================= */

(function () {
  "use strict";

  const form = document.getElementById("demandeForm");
  const btn = document.getElementById("submitBtn");
  if (!form) return;

  // Focus first control
  const first = form.querySelector("input, select, textarea");
  if (first) setTimeout(() => first.focus(), 150);

  // Optional: add class to widgets (if you want to target .a-control later)
  form.querySelectorAll("input, select, textarea").forEach(el => {
    el.classList.add("a-control");
  });

  // Loading on submit
  form.addEventListener("submit", () => {
    form.classList.add("is-loading");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    }
  });
})();

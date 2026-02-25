/* =========================================================
   Clean Plus Admin — STAFF FORM (JS)
   - Focus first control
   - Loading state on submit
   ========================================================= */

(function () {
  "use strict";

  const form = document.getElementById("staffForm");
  const btn = document.getElementById("submitBtn");
  if (!form) return;

  const first = form.querySelector("input, select, textarea");
  if (first) setTimeout(() => first.focus(), 150);

  form.addEventListener("submit", () => {
    form.classList.add("is-loading");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    }
  });
})();

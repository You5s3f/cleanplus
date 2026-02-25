/* =========================================================
   Clean Plus Admin — STAFF DETAIL (JS)
   - Confirm toggle (activer/désactiver)
   - Loading state
   ========================================================= */

(function () {
  "use strict";

  const form = document.getElementById("toggleForm");
  const btn = document.getElementById("toggleBtn");
  if (!form || !btn) return;

  form.addEventListener("submit", (e) => {
    const state = btn.dataset.state; // active / inactive
    const msg = (state === "active")
      ? "Confirmer la désactivation de cette intervenante ?"
      : "Confirmer l’activation de cette intervenante ?";

    const ok = confirm(msg);
    if (!ok) {
      e.preventDefault();
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
  });
})();

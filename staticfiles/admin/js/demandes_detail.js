/* =========================================================
   Clean Plus Admin — DEMANDES DETAIL (JS)
   - Confirm changement de statut
   - Loading state au submit
   - Petit feedback sur badge
   ========================================================= */

(function () {
  "use strict";

  const form = document.getElementById("statusForm");
  const select = document.getElementById("id_statut");
  const badge = document.getElementById("statusBadge");
  const btn = document.getElementById("saveStatusBtn");

  if (!form || !select) return;

  const initialValue = select.value;

  // Petite UX: si on change le select, on pulse le badge
  select.addEventListener("change", () => {
    if (!badge) return;
    badge.style.transition = "transform .12s ease";
    badge.style.transform = "scale(0.97)";
    setTimeout(() => (badge.style.transform = "scale(1)"), 120);
  });

  form.addEventListener("submit", (e) => {
    // Si pas de changement, on évite submit inutile
    if (select.value === initialValue) {
      e.preventDefault();
      return;
    }

    const selectedText = select.options[select.selectedIndex]?.textContent?.trim() || "ce statut";
    const ok = confirm(`Confirmer le changement de statut vers "${selectedText}" ?`);
    if (!ok) {
      e.preventDefault();
      return;
    }

    // Loading
    form.classList.add("is-loading");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    }
  });
})();

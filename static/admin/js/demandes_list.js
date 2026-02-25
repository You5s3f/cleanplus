/* =========================================================
   Clean Plus Admin — DEMANDES LIST (JS)
   - Filter live (front)
   - Empty state
   ========================================================= */

(function () {
  "use strict";

  const tbody = document.getElementById("demandesTbody");
  const empty = document.getElementById("emptyState");
  if (!tbody) return;

  const searchInput = document.querySelector('input[name="q"]');

  function rows() {
    return Array.from(tbody.querySelectorAll(".a-row"));
  }

  function norm(v) {
    return (v || "").toString().trim().toLowerCase();
  }

  function apply() {
    const q = norm(searchInput ? searchInput.value : "");
    let visible = 0;

    rows().forEach(r => {
      const hay = [
        r.dataset.id,
        r.dataset.client,
        r.dataset.phone,
        r.dataset.email,
        r.dataset.adresse,
        r.dataset.statut,
        r.dataset.service
      ].map(norm).join(" ");

      const ok = !q || hay.includes(q);
      r.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    if (empty) empty.style.display = (visible === 0) ? "block" : "none";
  }

  if (searchInput) {
    searchInput.addEventListener("input", apply);
  }

  apply();
})();

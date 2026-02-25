/* =========================================================
   Clean Plus Admin — STAFF LIST (JS)
   - Live search on current rows
   - Empty state
   ========================================================= */

(function () {
  "use strict";

  const tbody = document.getElementById("staffTbody");
  const empty = document.getElementById("staffEmptyState");
  const search = document.getElementById("staffSearch");

  if (!tbody || !search) return;

  function norm(v){ return (v || "").toString().toLowerCase().trim(); }
  function rows(){ return Array.from(tbody.querySelectorAll(".staff-row")); }

  function apply(){
    const q = norm(search.value);
    let visible = 0;

    rows().forEach(r => {
      const hay = [
        r.dataset.name,
        r.dataset.phone,
        r.dataset.zone,
        r.dataset.dispo,
        r.dataset.statut
      ].map(norm).join(" ");

      const ok = !q || hay.includes(q);
      r.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    if (empty) empty.style.display = (visible === 0) ? "block" : "none";
  }

  search.addEventListener("input", apply);
  apply();
})();

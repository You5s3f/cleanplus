/* =========================================================
   Clean Plus Admin — RDV LIST (JS)
   Recherche + filtres (statut/service/femme) + empty state
   Compatible avec ton HTML (data-*)
   ========================================================= */

(function () {
  "use strict";

  const searchInput = document.getElementById("searchAppointments");
  const filterStatus = document.getElementById("filterStatus");
  const filterService = document.getElementById("filterService");
  const filterFemme = document.getElementById("filterFemme");

  const btnApply = document.getElementById("btnApplyFilters");
  const btnReset = document.getElementById("btnResetFilters");

  const tbody = document.getElementById("rdvTbody");
  const emptyState = document.getElementById("emptyState");

  function getRows() {
    if (!tbody) return [];
    return Array.from(tbody.querySelectorAll(".rdv-row"));
  }

  function norm(v) {
    return (v || "").toString().trim().toLowerCase();
  }

  function rowMatchesSearch(row, q) {
    if (!q) return true;

    // On cherche dans plusieurs champs (via data-*)
    const id = norm(row.dataset.id);
    const dt = norm(row.dataset.datetime);
    const adresse = norm(row.dataset.adresse);
    const service = norm(row.dataset.service);
    const femme = norm(row.dataset.femme);
    const statut = norm(row.dataset.statut);

    const haystack = `${id} ${dt} ${adresse} ${service} ${femme} ${statut}`;
    return haystack.includes(q);
  }

  function rowMatchesFilters(row, status, service, femme) {
    const rowStatus = norm(row.dataset.statut);
    const rowService = norm(row.dataset.service);
    const rowFemme = norm(row.dataset.femme);

    const okStatus = (status === "all") ? true : rowStatus === norm(status);
    const okService = (service === "all") ? true : rowService === norm(service);
    const okFemme  = (femme === "all")  ? true : rowFemme === norm(femme);

    return okStatus && okService && okFemme;
  }

  function apply() {
    const q = norm(searchInput ? searchInput.value : "");
    const status = filterStatus ? filterStatus.value : "all";
    const service = filterService ? filterService.value : "all";
    const femme = filterFemme ? filterFemme.value : "all";

    const rows = getRows();
    let visibleCount = 0;

    rows.forEach(row => {
      const ok =
        rowMatchesSearch(row, q) &&
        rowMatchesFilters(row, status, service, femme);

      row.classList.toggle("is-hidden", !ok);
      if (ok) visibleCount++;
    });

    if (emptyState) {
      emptyState.style.display = (visibleCount === 0) ? "block" : "none";
    }
  }

  function reset() {
    if (searchInput) searchInput.value = "";
    if (filterStatus) filterStatus.value = "all";
    if (filterService) filterService.value = "all";
    if (filterFemme) filterFemme.value = "all";
    apply();
  }

  // --- Events ---
  if (searchInput) {
    // recherche live (instant)
    searchInput.addEventListener("input", apply);
  }

  if (btnApply) btnApply.addEventListener("click", apply);
  if (btnReset) btnReset.addEventListener("click", reset);

  // Enter dans l'input => apply
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        apply();
      }
    });
  }

  // Init
  apply();
})();

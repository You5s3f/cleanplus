/* =========================================================
   Clean Plus Admin — RDV CALENDAR WEEK (JS)
   - Highlight "Aujourd’hui"
   ========================================================= */

(function () {
  "use strict";

  const days = document.querySelectorAll(".az-day");
  if (!days.length) return;

  const today = new Date().toISOString().slice(0,10);

  days.forEach(day => {
    const dateEl = day.querySelector(".az-day-date");
    if (!dateEl) return;

    if (dateEl.textContent.trim() === today) {
      day.classList.add("is-today");
    }
  });
})();

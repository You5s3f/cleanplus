/* =========================================================
   Clean Plus Admin — Create RDV from Demande (JS)
   - Focus premier champ
   - Loading state au submit
   ========================================================= */

(function () {
  "use strict";

  const form = document.querySelector(".a-form");
  if (!form) return;

  // focus first control
  const first = form.querySelector("input, select, textarea");
  if (first) setTimeout(() => first.focus(), 150);

  form.addEventListener("submit", () => {
    form.classList.add("is-loading");
  });
})();

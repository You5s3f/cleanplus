/* =========================================================
   Clean Plus Admin — RDV CREATE / FORM (JS)
   - Loading on submit
   - Focus first field
   ========================================================= */

(function () {
  "use strict";

  const form = document.querySelector(".form");
  if (!form) return;

  const firstInput = form.querySelector("input, select, textarea");
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 150);
  }

  form.addEventListener("submit", () => {
    form.classList.add("is-loading");
  });
})();

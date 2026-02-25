/* =========================================================
   Clean Plus Admin — KPI DASHBOARD (JS)
   - Small animation on spark bars
   ========================================================= */

(function () {
  "use strict";

  document.querySelectorAll(".kpi-spark").forEach((el, idx) => {
    el.animate(
      [
        { transform: "translateX(-12px)", opacity: 0.55 },
        { transform: "translateX(12px)", opacity: 0.95 },
        { transform: "translateX(-12px)", opacity: 0.55 },
      ],
      { duration: 2400 + idx * 220, iterations: Infinity, easing: "ease-in-out" }
    );
  });
})();

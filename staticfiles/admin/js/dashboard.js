/* =========================================================
   Clean Plus Admin — DASHBOARD (JS)
   - Just a tiny polish: animate spark bars
   ========================================================= */

(function () {
  "use strict";

  document.querySelectorAll(".dash-spark").forEach((el, idx) => {
    el.animate(
      [
        { transform: "translateX(-10px)", opacity: 0.55 },
        { transform: "translateX(10px)", opacity: 0.95 },
        { transform: "translateX(-10px)", opacity: 0.55 },
      ],
      { duration: 2200 + idx * 180, iterations: Infinity, easing: "ease-in-out" }
    );
  });
})();

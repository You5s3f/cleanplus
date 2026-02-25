/* =========================================================
   Clean Plus Admin — RDV DAY (JS)
   - Auto-scroll vers l'heure actuelle (si day == today)
   - Highlight de la ligne actuelle
   ========================================================= */

(function () {
  "use strict";

  const rows = Array.from(document.querySelectorAll(".az-time-row"));
  if (!rows.length) return;

  // On détecte si la page est "Aujourd'hui" via le bouton "Aujourd’hui" (simple et safe)
  // Si tu veux mieux: injecter un data-is-today depuis Django.
  const todayBtn = Array.from(document.querySelectorAll("a")).find(a => a.textContent.trim() === "Aujourd’hui");
  const isLikelyToday = !!todayBtn && !todayBtn.href.includes("date="); // ton lien today n'a pas ?date=

  if (!isLikelyToday) return;

  const now = new Date();
  const hh = now.getHours();
  const targetText = `${hh}:00`;

  // trouver la ligne correspondante
  const targetRow = rows.find(r => {
    const col = r.querySelector(".az-time-col");
    return col && col.textContent.trim() === targetText;
  });

  if (!targetRow) return;

  // Highlight
  targetRow.style.borderColor = "rgba(37,99,235,.35)";
  targetRow.style.boxShadow = "var(--shadow-sm)";
  targetRow.style.background = "rgba(37,99,235,.06)";

  // Scroll (après render)
  setTimeout(() => {
    targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 150);
})();

/* =========================================================
   Clean Plus Admin — RDV DETAIL (JS) [OPTIONNEL]
   - Click sur badge => copie le statut/ID
   ========================================================= */

(function () {
  "use strict";

  const badge = document.querySelector(".az-card .badge");
  if (!badge) return;

  badge.style.cursor = "pointer";
  badge.title = "Cliquer pour copier";

  badge.addEventListener("click", async () => {
    try {
      const txt = badge.textContent.trim();
      await navigator.clipboard.writeText(txt);

      const old = badge.textContent;
      badge.textContent = "Copié ✓";
      badge.style.transition = "transform .12s ease";
      badge.style.transform = "scale(0.97)";
      setTimeout(() => (badge.style.transform = "scale(1)"), 120);

      setTimeout(() => (badge.textContent = old), 900);
    } catch (e) {
      // si clipboard bloqué, on ignore
    }
  });
})();

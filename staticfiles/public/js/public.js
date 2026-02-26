(function () {
  const toggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("cpDrawer");
  const overlay = document.getElementById("cpOverlay");
  const closeBtn = document.getElementById("cpDrawerClose");

  if (!toggle || !drawer || !overlay || !closeBtn) return;

  let lastFocusEl = null;

  function isOpen() {
    return drawer.classList.contains("is-open");
  }

  function openDrawer() {
    if (isOpen()) return;

    lastFocusEl = document.activeElement;

    drawer.classList.add("is-open");
    overlay.classList.add("is-open");

    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");

    toggle.setAttribute("aria-expanded", "true");

    document.documentElement.classList.add("cp-lock");
    document.body.classList.add("cp-lock");

    // Focus sur le bouton fermer pour accessibilité
    closeBtn.focus();
  }

  function closeDrawer() {
    if (!isOpen()) return;

    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");

    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");

    toggle.setAttribute("aria-expanded", "false");

    document.documentElement.classList.remove("cp-lock");
    document.body.classList.remove("cp-lock");

    // Retour focus sur le bouton menu (ou dernier focus)
    (lastFocusEl || toggle).focus();
  }

  function toggleDrawer() {
    isOpen() ? closeDrawer() : openDrawer();
  }

  // Clicks
  toggle.addEventListener("click", toggleDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Fermer en cliquant sur un lien dans le drawer
  drawer.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeDrawer();
  });

  // Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
})();

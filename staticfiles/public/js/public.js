(function () {
  const toggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("cpDrawer");
  const overlay = document.getElementById("cpOverlay");
  const closeBtn = document.getElementById("cpDrawerClose");

  if (!toggle || !drawer || !overlay || !closeBtn) return;

  function openDrawer() {
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("cp-lock");
    document.body.classList.add("cp-lock");
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("cp-lock");
    document.body.classList.remove("cp-lock");
  }

  toggle.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
})();

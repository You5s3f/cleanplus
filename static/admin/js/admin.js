/* =========================================================
   Clean Plus Admin — BASE UI (JS)
   Compatible avec ton template (ids/classes a-*)
   ========================================================= */

(function () {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const safeOn = (el, evt, fn) => { if (el) el.addEventListener(evt, fn); };

  function isMobile() {
    return window.matchMedia("(max-width: 880px)").matches;
  }

  // ---------- Elements ----------
  const sidebar = $("#sidebar");
  const overlay = $("#overlay");
  const toggleSidebarBtn = $("#toggleSidebar");

  const userMenuBtn = $("#userMenuBtn");
  const userDropdown = $("#userDropdown");

  const notificationBtn = $("#notificationBtn");
  const notificationDropdown = $("#notificationDropdown");

  const quickSettingsBtn = $("#quickSettings");
  const quickPanel = $("#quickPanel");
  const closeQuickPanelBtn = $("#closeQuickPanel");

  const searchInput = $("#globalSearch");
  const suggestionsBox = $("#searchSuggestions");

  const fab = $("#fab");

  const liveClock = $("#live-clock");

 // ---------- Sidebar (mobile drawer + desktop icon-only) ----------
const STORAGE = {
  theme: "cp_theme",
  density: "cp_density",
  sidebar: "cp_sidebar" // "open" | "closed"
};

function setToggleIcon() {
  const i = toggleSidebarBtn ? toggleSidebarBtn.querySelector("i") : null;
  if (!i) return;

  // Desktop : cp-icon => chevron, sinon bars
  if (!isMobile() && document.body.classList.contains("cp-icon")) {
    i.className = "fas fa-chevron-right";
  } else {
    i.className = "fas fa-bars";
  }
}

function openSidebar() {
  if (!sidebar) return;

  if (isMobile()) {
    sidebar.classList.add("is-open");
    if (overlay) {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
    }
  } else {
    document.body.classList.remove("cp-icon");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  localStorage.setItem(STORAGE.sidebar, "open");
  setToggleIcon();
}

function closeSidebar() {
  if (!sidebar) return;

  if (isMobile()) {
    sidebar.classList.remove("is-open");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  } else {
    document.body.classList.add("cp-icon");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  localStorage.setItem(STORAGE.sidebar, "closed");
  setToggleIcon();
}

function toggleSidebar() {
  if (!sidebar) return;

  if (isMobile()) {
    sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
  } else {
    document.body.classList.contains("cp-icon") ? openSidebar() : closeSidebar();
  }
}

safeOn(toggleSidebarBtn, "click", (e) => {
  e.preventDefault();
  toggleSidebar();
});

safeOn(overlay, "click", () => {
  // en mobile: ferme le drawer
  if (isMobile()) closeSidebar();
  closeDropdowns();
  closeQuickPanel();
  closeFab();
});

function applySidebarState() {
  if (!sidebar) return;

  const saved = localStorage.getItem(STORAGE.sidebar) || "open";

  if (isMobile()) {
    // Mobile: drawer fermé au chargement
    sidebar.classList.remove("is-open");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("cp-icon");
  } else {
    // Desktop: saved closed => icon-only
    if (saved === "closed") document.body.classList.add("cp-icon");
    else document.body.classList.remove("cp-icon");

    sidebar.classList.remove("is-open");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  setToggleIcon();
}


  // ---------- Dropdowns ----------
  function closeDropdowns() {
    if (userDropdown) userDropdown.classList.remove("is-open");
    if (notificationDropdown) notificationDropdown.classList.remove("is-open");
  }

  safeOn(userMenuBtn, "click", (e) => {
    e.preventDefault();
    if (!userDropdown) return;
    // fermer l'autre
    if (notificationDropdown) notificationDropdown.classList.remove("is-open");
    userDropdown.classList.toggle("is-open");
  });

  safeOn(notificationBtn, "click", (e) => {
    e.preventDefault();
    if (!notificationDropdown) return;
    // fermer l'autre
    if (userDropdown) userDropdown.classList.remove("is-open");
    notificationDropdown.classList.toggle("is-open");
    // demo: si liste vide, on injecte quelques notifications
    injectDemoNotifications();
  });

  // Fermer dropdowns quand clic dehors
  document.addEventListener("click", (e) => {
    const t = e.target;

    // user dropdown
    if (userDropdown && userDropdown.classList.contains("is-open")) {
      const insideUser = userDropdown.contains(t) || (userMenuBtn && userMenuBtn.contains(t));
      if (!insideUser) userDropdown.classList.remove("is-open");
    }

    // notif dropdown
    if (notificationDropdown && notificationDropdown.classList.contains("is-open")) {
      const insideNotif = notificationDropdown.contains(t) || (notificationBtn && notificationBtn.contains(t));
      if (!insideNotif) notificationDropdown.classList.remove("is-open");
    }

    // quick panel
    if (quickPanel && quickPanel.classList.contains("is-open")) {
      const insideQuick = quickPanel.contains(t) || (quickSettingsBtn && quickSettingsBtn.contains(t));
      if (!insideQuick) closeQuickPanel();
    }

    // fab
    if (fab && fab.classList.contains("is-open")) {
      const insideFab = fab.contains(t);
      if (!insideFab) closeFab();
    }
  });

  // Escape pour tout fermer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
      closeDropdowns();
      closeQuickPanel();
      closeFab();
      closeSuggestions();
    }
  });

  // ---------- Quick Panel ----------
  function openQuickPanel() {
    if (!quickPanel) return;
    quickPanel.classList.add("is-open");
  }
  function closeQuickPanel() {
    if (!quickPanel) return;
    quickPanel.classList.remove("is-open");
  }

  safeOn(quickSettingsBtn, "click", (e) => {
    e.preventDefault();
    if (!quickPanel) return;
    quickPanel.classList.toggle("is-open");
  });

  safeOn(closeQuickPanelBtn, "click", (e) => {
    e.preventDefault();
    closeQuickPanel();
  });

  // ---------- Theme (light/dark/auto) ----------
  function applyTheme(mode) {
    // mode: "light" | "dark" | "auto"
    let theme = mode;

    if (mode === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme = prefersDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", theme);
    // classes utiles si besoin
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add("theme-" + theme);

    localStorage.setItem(STORAGE.theme, mode); // on stocke le mode choisi (auto possible)
    markActiveThemeButtons(mode);
  }

  function markActiveThemeButtons(mode) {
    $$(".a-theme-option").forEach(btn => {
      const active = btn.getAttribute("data-theme") === mode;
      btn.classList.toggle("is-active", active);
    });
  }

  // Init theme button
  $$(".a-theme-option").forEach(btn => {
    safeOn(btn, "click", () => {
      const mode = btn.getAttribute("data-theme");
      applyTheme(mode);
    });
  });

  // ---------- Density ----------
  function applyDensity(mode) {
    // mode: "comfortable" | "compact"
    document.documentElement.setAttribute("data-density", mode);
    localStorage.setItem(STORAGE.density, mode);
    $$(".a-density-option").forEach(btn => {
      btn.classList.toggle("is-active", btn.getAttribute("data-density") === mode);
    });
  }

  $$(".a-density-option").forEach(btn => {
    safeOn(btn, "click", () => {
      const mode = btn.getAttribute("data-density");
      applyDensity(mode);
    });
  });

  // ---------- Live clock ----------
  function tickClock() {
    if (!liveClock) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    liveClock.textContent = `${hh}:${mm}`;
  }

  // ---------- Alerts close ----------
  function initAlertClose() {
    $$(".a-alert-close").forEach(btn => {
      safeOn(btn, "click", (e) => {
        e.preventDefault();
        const alert = btn.closest(".a-alert");
        if (!alert) return;
        alert.style.transition = "opacity .15s ease, transform .15s ease";
        alert.style.opacity = "0";
        alert.style.transform = "translateY(-6px)";
        setTimeout(() => alert.remove(), 160);
      });
    });
  }

  // ---------- Search suggestions (simple demo) ----------
  const demoSuggestions = [
    { label: "Demandes", hint: "Gestion des devis", icon: "fa-file-lines" },
    { label: "Rendez-vous", hint: "Planning & calendrier", icon: "fa-calendar-check" },
    { label: "Équipe", hint: "Employés / staff", icon: "fa-user-group" },
    { label: "Services", hint: "Catalogue", icon: "fa-spray-can-sparkles" },
  ];

  function renderSuggestions(items) {
    if (!suggestionsBox) return;
    suggestionsBox.innerHTML = "";
    items.forEach(it => {
      const div = document.createElement("div");
      div.className = "a-suggest-item";
      div.innerHTML = `
        <i class="fas ${it.icon}" style="color: var(--primary); width:18px; text-align:center;"></i>
        <div style="display:flex;flex-direction:column;">
          <div style="font-weight:900;font-size:13px;">${it.label}</div>
          <div class="a-suggest-muted">${it.hint}</div>
        </div>
      `;
      suggestionsBox.appendChild(div);
    });
    suggestionsBox.classList.toggle("is-open", items.length > 0);
  }

  function closeSuggestions() {
    if (!suggestionsBox) return;
    suggestionsBox.classList.remove("is-open");
  }

  safeOn(searchInput, "input", () => {
    const q = (searchInput.value || "").trim().toLowerCase();
    if (!q) { closeSuggestions(); return; }
    const filtered = demoSuggestions.filter(s => s.label.toLowerCase().includes(q));
    renderSuggestions(filtered);
  });

  safeOn(searchInput, "focus", () => {
    const q = (searchInput.value || "").trim();
    if (q) {
      const filtered = demoSuggestions.filter(s => s.label.toLowerCase().includes(q.toLowerCase()));
      renderSuggestions(filtered);
    }
  });

  // Raccourci "/" pour focus search
  document.addEventListener("keydown", (e) => {
    if (!searchInput) return;
    if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
      if (!typing) {
        e.preventDefault();
        searchInput.focus();
      }
    }
  });

  // ---------- Notifications demo ----------
  function injectDemoNotifications() {
    if (!notificationDropdown) return;
    const list = notificationDropdown.querySelector(".a-notification-list");
    if (!list) return;

    // si déjà rempli, ne pas dupliquer
    if (list.children.length > 0) return;

    const data = [
      { title: "Nouvelle demande reçue", text: "Un client a envoyé une demande de devis." },
      { title: "RDV confirmé", text: "Un rendez-vous a été confirmé pour demain." },
      { title: "Service mis à jour", text: "Le catalogue a été modifié." },
    ];

    data.forEach(n => {
      const item = document.createElement("div");
      item.className = "a-notif-item";
      item.innerHTML = `
        <div class="a-notif-dot"></div>
        <div>
          <div class="a-notif-title">${n.title}</div>
          <div class="a-notif-text">${n.text}</div>
        </div>
      `;
      list.appendChild(item);
    });
  }

  // Mark all read
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".a-mark-all-read");
    if (!btn) return;
    const list = notificationDropdown && notificationDropdown.querySelector(".a-notification-list");
    if (list) list.innerHTML = "";
    const count = $(".a-notification-count");
    if (count) count.textContent = "0";
  });

  // ---------- FAB ----------
  function closeFab() {
    if (!fab) return;
    fab.classList.remove("is-open");
  }
  safeOn(fab, "click", (e) => {
    // si clic sur un lien du menu, laisse naviguer
    const link = e.target.closest(".a-fab-item");
    if (link) return;
    e.preventDefault();
    fab.classList.toggle("is-open");
  });

  // ---------- Resize handling ----------
  window.addEventListener("resize", () => {
    applySidebarState();
    closeDropdowns();
    closeSuggestions();
    // quick panel on garde
  });

  // ---------- Init ----------
  function init() {
    // theme: mode stocké (auto possible)
    const savedMode = localStorage.getItem(STORAGE.theme) || "auto";
    applyTheme(savedMode);

    // density
    const savedDensity = localStorage.getItem(STORAGE.density) || "comfortable";
    applyDensity(savedDensity);

    // sidebar
    applySidebarState();

    // clock
    tickClock();
    setInterval(tickClock, 1000 * 15);

    // alerts
    initAlertClose();
  }

  init();
})();











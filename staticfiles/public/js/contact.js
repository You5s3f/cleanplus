(function () {
  const form = document.getElementById("cpContactForm");
  if (!form) return;

  const confirmBox = document.getElementById("cpConfirmation");
  const resetBtn = document.getElementById("cpResetForm");

  function setError(id, msg) {
    const el = document.querySelector(`[data-err-for="${id}"]`);
    if (el) el.textContent = msg || "";
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function clearErrors() {
    ["contactName", "contactEmail", "contactSubject", "contactMessage", "contactPrivacy"].forEach(k => setError(k, ""));
  }

  form.addEventListener("submit", (e) => {
    clearErrors();

    let ok = true;

    const name = getVal("contactName");
    const email = getVal("contactEmail");
    const subject = getVal("contactSubject");
    const msg = getVal("contactMessage");
    const privacy = document.getElementById("contactPrivacy")?.checked;

    if (!name) { setError("contactName", "Veuillez saisir votre nom."); ok = false; }
    if (!email) { setError("contactEmail", "Veuillez saisir votre email."); ok = false; }
    else if (!validEmail(email)) { setError("contactEmail", "Email invalide."); ok = false; }

    if (!subject) { setError("contactSubject", "Veuillez sélectionner un sujet."); ok = false; }
    if (!msg) { setError("contactMessage", "Veuillez écrire un message."); ok = false; }
    if (!privacy) { setError("contactPrivacy", "Vous devez accepter la politique de confidentialité."); ok = false; }

    if (!ok) {
      e.preventDefault();
      return;
    }

    // Si tu n'as pas encore de backend pour traiter, on montre une confirmation fake:
    // ⚠️ si tu as une vraie view Django, supprime les 3 lignes ci-dessous.
    e.preventDefault();
    form.style.display = "none";
    if (confirmBox) confirmBox.style.display = "flex";
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      clearErrors();
    });
  }
})();

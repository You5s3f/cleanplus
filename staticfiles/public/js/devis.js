document.addEventListener("DOMContentLoaded", () => {
  const quoteForm = document.getElementById("quoteForm");
  if (!quoteForm) return;

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");

  const postalCode = document.getElementById("postalCode");
  const city = document.getElementById("city");

  const propertyType = document.getElementById("propertyType");
  const rooms = document.getElementById("rooms");
  const preferredTime = document.getElementById("preferredTime");

  const specialRequests = document.getElementById("specialRequests");
  const howFound = document.getElementById("howFound");
  const provideProducts = document.getElementById("provideProducts");
  const keyHandover = document.getElementById("keyHandover");
  const privacyPolicy = document.getElementById("privacyPolicy");

  // Champs Django cachés (form.nom & form.message)
  const hiddenNom = quoteForm.querySelector('input[name="nom"]');
  const hiddenMessage = quoteForm.querySelector('textarea[name="message"], input[name="message"]');

  function buildFullName() {
    const fn = (firstName?.value || "").trim();
    const ln = (lastName?.value || "").trim();
    return [fn, ln].filter(Boolean).join(" ");
  }

  function buildMessage() {
    const lines = [];

    const fullName = buildFullName();
    if (fullName) lines.push(`Nom complet: ${fullName}`);

    if (postalCode?.value) lines.push(`Code postal: ${postalCode.value.trim()}`);
    if (city?.value) lines.push(`Ville: ${city.value.trim()}`);

    if (propertyType?.value) lines.push(`Type de bien: ${propertyType.value}`);
    if (rooms?.value) lines.push(`Nombre de pièces: ${rooms.value}`);
    if (preferredTime?.value) lines.push(`Horaire préféré: ${preferredTime.value}`);

    lines.push(`Produits fournis: ${provideProducts?.checked ? "Oui" : "Non"}`);
    lines.push(`Clés laissées: ${keyHandover?.checked ? "Oui" : "Non"}`);

    if (howFound?.value) lines.push(`Source: ${howFound.value}`);

    if (specialRequests?.value?.trim()) {
      lines.push("Demandes particulières:");
      lines.push(specialRequests.value.trim());
    }

    return lines.join("\n");
  }

  function syncHiddenFields() {
    if (hiddenNom) hiddenNom.value = buildFullName();
    if (hiddenMessage) hiddenMessage.value = buildMessage();
  }

  // Sync live
  [firstName, lastName, postalCode, city, propertyType, rooms, preferredTime, specialRequests, howFound, provideProducts, keyHandover]
    .filter(Boolean)
    .forEach((el) => {
      el.addEventListener("input", syncHiddenFields);
      el.addEventListener("change", syncHiddenFields);
    });

  // Submit
  quoteForm.addEventListener("submit", (e) => {
    // sync final
    syncHiddenFields();

    // UI required fields check (simple)
    const requiredUI = [firstName, lastName, postalCode, city, propertyType, privacyPolicy].filter(Boolean);

    let ok = true;
    requiredUI.forEach((el) => {
      const isCheckbox = el.type === "checkbox";
      const valid = isCheckbox ? el.checked : !!el.value.trim();
      el.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      e.preventDefault();
      // petit scroll vers le haut du form
      quoteForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

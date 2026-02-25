(function () {
  const form = document.getElementById("quoteForm");
  if (!form) return;

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

  // Champs Django cachés
  const djangoNom = form.querySelector('input[name="nom"]');
  const djangoMsg = form.querySelector('textarea[name="message"]');

  function nomComplet() {
    const fn = (firstName?.value || "").trim();
    const ln = (lastName?.value || "").trim();
    return (fn + " " + ln).trim();
  }

  function buildMessage() {
    const lines = [];
    lines.push(`Ville: ${(city?.value || "").trim()}`);
    lines.push(`Code postal: ${(postalCode?.value || "").trim()}`);
    lines.push(`Type de bien: ${(propertyType?.value || "").trim()}`);
    lines.push(`Nombre de pièces: ${(rooms?.value || "").trim()}`);
    lines.push(`Horaire préféré: ${(preferredTime?.value || "").trim()}`);
    lines.push(`Connu via: ${(howFound?.value || "").trim()}`);
    lines.push(`Produits fournis: ${provideProducts?.checked ? "Oui" : "Non"}`);
    lines.push(`Clés laissées: ${keyHandover?.checked ? "Oui" : "Non"}`);

    const extra = (specialRequests?.value || "").trim();
    if (extra) {
      lines.push("");
      lines.push("Demandes particulières:");
      lines.push(extra);
    }

    return lines.map(x => x.trim()).filter(Boolean).join("\n");
  }

  form.addEventListener("submit", function () {
    if (djangoNom) djangoNom.value = nomComplet();
    if (djangoMsg) djangoMsg.value = buildMessage();
  });
})();

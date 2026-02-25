document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  const card = document.querySelector(".cps-card");
  if (!card) return;

  card.animate(
    [
      { transform: "translateY(10px)", opacity: 0 },
      { transform: "translateY(0px)", opacity: 1 }
    ],
    { duration: 260, easing: "ease-out" }
  );
});

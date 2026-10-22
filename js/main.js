
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const year = document.querySelector("#year");

  // Met automatiquement l'année actuelle dans le pied de page.
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Si la page ne possède pas de menu, on arrête ici.
  if (!menuButton || !navigation) return;

  // Ouverture et fermeture du menu sur mobile.
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
  });

  // Ferme le menu après le choix d'une page.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Ouvrir le menu");
      menuButton.textContent = "☰";
    });
  });
});

// Charger dynamiquement la navigation mobile
function loadMobileNav() {
  fetch("components/mobile-nav.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la navigation mobile");
      }
      return response.text();
    })
    .then((html) => {
      const navContainer = document.createElement('div');
      navContainer.innerHTML = html;
      document.body.appendChild(navContainer);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de la navigation mobile :", error);
    });
}

// Initialiser la navigation mobile
document.addEventListener("DOMContentLoaded", loadMobileNav);

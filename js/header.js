// Charger dynamiquement le header
function loadHeader(title) {
  const headerElement = document.createElement('header');
  headerElement.innerHTML = `<h1>${title}</h1>`;
  document.body.insertBefore(headerElement, document.body.firstChild);
}

// Initialiser le header
document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.title || "Titre de la Page";
  loadHeader(pageTitle);
});
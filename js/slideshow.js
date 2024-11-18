export function initializeSlideshow() {
  const slidesContainer = document.getElementById("slidesContainer");

  if (!slidesContainer) {
    console.error("Élément slidesContainer introuvable.");
    return;
  }

  let isDragging = false; // État du glisser
  let startY = 0; // Position Y initiale (souris ou tactile)
  let scrollTop = 0; // Position initiale du défilement

  // Fonction commune pour commencer le glisser
  const startDrag = (y) => {
    isDragging = true;
    slidesContainer.classList.add("dragging");
    startY = y; // Position Y initiale (souris ou tactile)
    scrollTop = slidesContainer.scrollTop; // Position actuelle du défilement
  };

  // Fonction commune pour effectuer le glisser
  const drag = (y) => {
    if (!isDragging) return;
    const walk = startY - y; // Distance parcourue
    slidesContainer.scrollTop = scrollTop + walk; // Appliquer le défilement
  };

  // Fonction commune pour terminer le glisser
  const endDrag = () => {
    isDragging = false;
    slidesContainer.classList.remove("dragging");
  };

  // Gestion des événements souris
  slidesContainer.addEventListener("mousedown", (e) => startDrag(e.clientY));
  slidesContainer.addEventListener("mousemove", (e) => drag(e.clientY));
  slidesContainer.addEventListener("mouseup", endDrag);
  slidesContainer.addEventListener("mouseleave", endDrag);

  // Gestion des événements tactiles
  slidesContainer.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientY));
  slidesContainer.addEventListener("touchmove", (e) => {
    drag(e.touches[0].clientY);
    e.preventDefault(); // Évite le défilement natif sur mobile
  });
  slidesContainer.addEventListener("touchend", endDrag);
}

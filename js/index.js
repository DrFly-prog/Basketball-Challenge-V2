import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
 import { initializeSlideshow } from "./slideshow.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCq0c3FWkfKsO0vj2aGy5jPQt3BLHB3kGY",
  authDomain: "basketball-challenge-v2.firebaseapp.com",
  projectId: "basketball-challenge-v2",
  storageBucket: "basketball-challenge-v2.firebasestorage.app",
  messagingSenderId: "724994841928",
  appId: "1:724994841928:web:25777e6d448c6527fc277d",
  databaseURL: "https://basketball-challenge-v2-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Vérification de l'état de connexion de l'utilisateur
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Utilisateur connecté :", user.email);

    const userId = user.uid;
    const teamsRef = ref(db, "teams");

   // Appeler initializeSlideshow après avoir chargé les équipes
get(teamsRef).then((snapshot) => {
  const teams = snapshot.val();
  const slidesContainer = document.getElementById("slidesContainer");

  if (!slidesContainer) {
    console.error("L'élément slidesContainer est introuvable dans le DOM.");
    return;
  }

  slidesContainer.innerHTML = ""; // Réinitialiser le contenu

  for (const teamId in teams) {
    const membres = teams[teamId].membres || {};

    for (const memberId in membres) {
      if (membres[memberId].uid === userId) {
        // Création d'un bloc pour l'équipe
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("team-block");
        teamDiv.innerHTML = `
          <h4>${teams[teamId].nom}</h4>
          <p>${teams[teamId].description || "Pas de description disponible."}</p>
          <a href="team_details.html?teamId=${teamId}" class="team-link">Voir l'équipe</a>
        `;

        slidesContainer.appendChild(teamDiv);
        break;
      }
    }
  }

  initializeSlideshow(); // Initialiser le slideshow après avoir ajouté les équipes
}).catch((error) => {
  console.error("Erreur lors du chargement des équipes :", error);
});



  } else {
    // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
    window.location.href = "login.html";
  }
});

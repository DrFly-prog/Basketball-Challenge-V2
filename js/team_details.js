import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCq0c3FWkfKsO0vj2aGy5jPQt3BLHB3kGY",
  authDomain: "basketball-challenge-v2.firebaseapp.com",
  projectId: "basketball-challenge-v2",
  storageBucket: "basketball-challenge-v2-default-rtdb.europe-west1.firebasedatabase.app",
  messagingSenderId: "724994841928",
  appId: "1:724994841928:web:25777e6d448c6527fc277d",
  databaseURL: "https://basketball-challenge-v2-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Extraire l'ID de l'équipe depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get("teamId");

// Rediriger vers la page de classement
export function setupLeaderboardButton() {
  document.getElementById("leaderboardButton").addEventListener("click", () => {
    window.location.href = `leaderboard.html?teamId=${teamId}`;
  });
}

// Charger les détails de l'équipe et les challenges actifs
export function loadTeamDetails() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const teamRef = ref(db, `teams/${teamId}`);
      get(teamRef).then((snapshot) => {
        if (snapshot.exists()) {
          const teamData = snapshot.val();
          document.getElementById("teamName").textContent = teamData.nom;
          document.getElementById("teamDescription").textContent = teamData.description;

          loadActiveChallenges();
        } else {
          console.error("L'équipe n'existe pas.");
          document.getElementById("teamName").textContent = "Équipe non trouvée";
          document.getElementById("teamDescription").textContent = "Aucune information disponible.";
        }
      }).catch((error) => {
        console.error("Erreur lors du chargement de l'équipe :", error);
      });
    } else {
      window.location.href = "login.html";
    }
  });
}

// Charger les challenges actifs
function loadActiveChallenges() {
  const challengesRef = ref(db, "challenges");
  get(challengesRef).then((snapshot) => {
    if (snapshot.exists()) {
      const challenges = snapshot.val();
      const activeChallengesContainer = document.getElementById("activeChallengesContainer");

      for (const challengeId in challenges) {
        const challenge = challenges[challengeId];

        // Vérifier si le challenge est actif
        if (challenge.statut === "actif") {
          const challengeBlock = document.createElement("div");
          challengeBlock.classList.add("challenge-block");
          challengeBlock.innerHTML = `
            <h4>${challenge.nom}</h4>
            <p>${challenge.description}</p>
            <img src="${challenge.image}" alt="${challenge.nom}" style="width: 100px; height: auto;">
          `;
          challengeBlock.onclick = () => {
            window.location.href = `challenge.html?teamId=${teamId}&challengeId=${challengeId}`;
          };
          activeChallengesContainer.appendChild(challengeBlock);
        }
      }
    } else {
      console.error("Aucun challenge trouvé.");
      document.getElementById("activeChallengesContainer").textContent = "Aucun challenge actif disponible.";
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement des challenges :", error);
  });
}

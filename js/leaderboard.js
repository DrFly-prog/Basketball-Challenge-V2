import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCq0c3FWkfKsO0vj2aGy5jPQt3BLHB3kGY",
  authDomain: "basketball-challenge-v2.firebaseapp.com",
  projectId: "basketball-challenge-v2",
  storageBucket: "basketball-challenge-v2-default-rtdb.europe-west1.firebasestorage.app",
  messagingSenderId: "724994841928",
  appId: "1:724994841928:web:25777e6d448c6527fc277d",
  databaseURL: "https://basketball-challenge-v2-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Vérifier l'utilisateur et charger le leaderboard
export function checkUserAndLoadLeaderboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get("teamId");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;

      // Vérifier si l'utilisateur est membre de l'équipe
      const membersRef = ref(db, `teams/${teamId}/membres`);
      get(membersRef)
        .then((snapshot) => {
          const members = snapshot.val();
          let isUserInTeam = false;

          for (const memberId in members) {
            if (members[memberId].uid === userId) {
              isUserInTeam = true;
              break;
            }
          }

          if (isUserInTeam) {
            console.log("L'utilisateur est bien membre de l'équipe.");
            loadLeaderboard(teamId);
          } else {
            console.error("L'utilisateur n'est pas membre de cette équipe ou n'a pas les permissions requises.");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la vérification des droits d'accès :", error);
        });
    } else {
      console.error("Utilisateur non authentifié. Redirection vers la page de connexion.");
      window.location.href = "login.html";
    }
  });
}

// Charger les scores et afficher le classement
function loadLeaderboard(teamId) {
  const leaderboardTableBody = document.getElementById("leaderboardTable").querySelector("tbody");
  const membersRef = ref(db, `teams/${teamId}/membres`);
  const scoresRef = ref(db, `teams/${teamId}/scores`);

  get(membersRef)
    .then((membersSnapshot) => {
      const members = membersSnapshot.val();
      const scores = {};

      // Initialiser les scores des membres
      for (const memberId in members) {
        scores[memberId] = { pseudo: members[memberId].pseudo, totalScore: 0 };
      }

      // Charger les scores cumulés
      get(scoresRef)
        .then((scoresSnapshot) => {
          const challenges = scoresSnapshot.val();

          for (const challengeId in challenges) {
            const challengeScores = challenges[challengeId];
            for (const memberId in challengeScores) {
              if (scores[memberId]) {
                scores[memberId].totalScore += challengeScores[memberId].score || 0;
              }
            }
          }

          // Afficher le tableau trié
          const sortedScores = Object.values(scores).sort((a, b) => b.totalScore - a.totalScore);
          sortedScores.forEach((member) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${member.pseudo}</td><td>${member.totalScore}</td>`;
            leaderboardTableBody.appendChild(row);
          });
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des scores :", error);
        });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des membres de l'équipe :", error);
    });
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCq0c3FWkfKsO0vj2aGy5jPQt3BLHB3kGY",
  authDomain: "basketball-challenge-v2.firebaseapp.com",
  projectId: "basketball-challenge-v2",
  storageBucket: "basketball-challenge-v2.firebasestorage.app",
  messagingSenderId: "724994841928",
  appId: "1:724994841928:web:25777e6d448c6527fc277d",
  databaseURL: "https://basketball-challenge-v2-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Charger les informations du challenge
export function loadChallenge(teamId, challengeId) {
  const challengeRef = ref(db, `challenges/${challengeId}`);
  get(challengeRef).then((snapshot) => {
    const challengeData = snapshot.val();
    document.getElementById("challengeName").textContent = challengeData.nom;
    document.getElementById("challengeDescription").textContent = challengeData.description;
  });
}

// Charger les scores et afficher les membres
export function loadScores(teamId, challengeId) {
  const membersRef = ref(db, `teams/${teamId}/membres`);
  const scoresRef = ref(db, `teams/${teamId}/scores/${challengeId}`);

  get(membersRef).then((snapshot) => {
    const members = snapshot.val();
    const scoreTableBody = document.getElementById("scoreTableBody");
    const memberSelect = document.getElementById("memberSelect");

    // Charger les scores
    get(scoresRef).then((scoreSnapshot) => {
      const scores = scoreSnapshot.val() || {};

      Object.keys(members).forEach((memberId) => {
        const pseudo = members[memberId].pseudo;
        const score = scores[memberId]?.score || 0;

        // Ajouter au tableau des scores
        const row = document.createElement("tr");
        row.innerHTML = `<td>${pseudo}</td><td>${score}</td>`;
        scoreTableBody.appendChild(row);

        // Ajouter au champ de sélection
        const option = document.createElement("option");
        option.value = memberId;
        option.textContent = pseudo;
        memberSelect.appendChild(option);
      });
    });
  });
}

// Ajouter un point à un vainqueur
export function addScore(teamId, challengeId) {
  const winnerId = document.getElementById("memberSelect").value;
  const addScoreMessage = document.getElementById("addScoreMessage");
  const winnerScoreRef = ref(db, `teams/${teamId}/scores/${challengeId}/${winnerId}`);

  get(winnerScoreRef).then((snapshot) => {
    const currentScore = snapshot.val()?.score || 0;

    update(winnerScoreRef, { score: currentScore + 1 })
      .then(() => {
        addScoreMessage.textContent = "Point ajouté avec succès !";
        addScoreMessage.style.color = "green";
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du score :", error);
        addScoreMessage.textContent = "Erreur lors de l'ajout du point.";
        addScoreMessage.style.color = "red";
      });
  }).catch((error) => {
    console.error("Erreur lors de la récupération du score actuel :", error);
    addScoreMessage.textContent = "Erreur lors de la récupération du score.";
    addScoreMessage.style.color = "red";
  });
}

// Vérifier si l'utilisateur est connecté
export function checkUserAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get("teamId");
  const challengeId = urlParams.get("challengeId");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Utilisateur connecté UID :", user.uid);
      loadChallenge(teamId, challengeId);
      loadScores(teamId, challengeId);
    } else {
      console.log("Utilisateur non connecté");
    }
  });
}

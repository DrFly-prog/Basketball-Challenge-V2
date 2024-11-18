import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Configuration Firebase
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

// Charger les informations de l'utilisateur connecté
function loadUserProfile(userId) {
  const userRef = ref(db, `users/${userId}`);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      document.getElementById("taille").value = userData.taille || '';
      document.getElementById("poste").value = userData.poste || '';
    } else {
      console.log("Aucun profil trouvé pour cet utilisateur.");
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement du profil :", error);
  });
}

// Charger les équipes liées à l'utilisateur
function loadUserTeams(userId) {
  const userTeamsList = document.getElementById("userTeamsList");
  const teamsRef = ref(db, "teams");
  userTeamsList.innerHTML = "";

  get(teamsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const teams = snapshot.val();
      for (const teamId in teams) {
        const membres = teams[teamId].membres || {};

        for (const memberId in membres) {
          if (membres[memberId].uid === userId) {
            const listItem = document.createElement("li");
            listItem.textContent = `${teams[teamId].nom}`;
            userTeamsList.appendChild(listItem);
            break;
          }
        }
      }
    } else {
      console.log("Aucune équipe trouvée.");
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement des équipes de l'utilisateur :", error);
  });
}

// Charger les équipes dans le champ de sélection
function loadTeamsForSelection() {
  const teamsRef = ref(db, "teams");
  const teamSelect = document.getElementById("teamSelect");

  get(teamsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const teams = snapshot.val();

      for (const teamId in teams) {
        const team = teams[teamId];
        const option = document.createElement("option");
        option.value = teamId;
        option.textContent = team.nom;
        teamSelect.appendChild(option);
      }
    } else {
      console.log("Aucune équipe trouvée.");
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement des équipes :", error);
  });
}

// Remplacer un membre temporaire dans une équipe
function handleReplaceTemporaryMember(userId, selectedTeamId) {
  const existingPseudoContainer = document.getElementById("existingPseudoContainer");
  const existingPseudoSelect = document.getElementById("existingPseudoSelect");

  // Afficher le conteneur pour sélectionner un pseudo
  existingPseudoContainer.style.display = "block";

  const teamMembersRef = ref(db, `teams/${selectedTeamId}/membres`);
  get(teamMembersRef).then((snapshot) => {
    if (snapshot.exists()) {
      const membres = snapshot.val();
      existingPseudoSelect.innerHTML = "";

      for (const memberId in membres) {
        if (!membres[memberId].uid) { // Trouver les membres avec UID temporaire
          const option = document.createElement("option");
          option.value = memberId;
          option.textContent = membres[memberId].pseudo;
          existingPseudoSelect.appendChild(option);
        }
      }
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement des membres temporaires :", error);
  });

  document.getElementById("associatePseudoButton").addEventListener("click", () => {
    const selectedMemberId = existingPseudoSelect.value;

    const memberRef = ref(db, `teams/${selectedTeamId}/membres/${selectedMemberId}`);
    const userRef = ref(db, `users/${userId}`);

    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return update(memberRef, { uid: userId, pseudo: userData.pseudo });
      }
    }).then(() => {
      console.log("Pseudo temporaire remplacé avec succès.");
      existingPseudoContainer.style.display = "none";
      loadUserTeams(userId); // Mettre à jour l'affichage des équipes liées
    }).catch((error) => {
      console.error("Erreur lors de l'association du pseudo temporaire :", error);
    });
  });
}

// Gérer la soumission du formulaire pour rejoindre une équipe
document.getElementById("joinTeamForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = auth.currentUser.uid;
  const selectedTeamId = document.getElementById("teamSelect").value;

  handleReplaceTemporaryMember(userId, selectedTeamId);
});

// Déconnexion
document.getElementById("logoutButton").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Erreur lors de la déconnexion :", error);
  });
});

// Initialisation au chargement de la page
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Utilisateur connecté :", user.email);
    loadUserProfile(user.uid);
    loadTeamsForSelection();
    loadUserTeams(user.uid);
  } else {
    console.log("Utilisateur non authentifié. Redirection vers la page de connexion.");
    window.location.href = "login.html";
  }
});

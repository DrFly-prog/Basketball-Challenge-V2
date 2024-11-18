import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

export function loadTeams() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}`);

      // Vérifier le rôle de l'utilisateur
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();

          if (userData.role === "super-admin") {
            console.log("Utilisateur avec rôle 'super-admin' détecté :", userId);

            // Charger toutes les équipes pour un super-admin
            loadAllTeams();
          } else if (userData.role === "membre") {
            console.log("Utilisateur avec rôle 'membre' détecté :", userId);

            // Charger uniquement les équipes où l'utilisateur est membre
            loadMemberTeams(userId);
          } else {
            console.log("Rôle inconnu ou non autorisé :", userData.role);
          }
        } else {
          console.error("Utilisateur introuvable dans la base de données.");
        }
      }).catch((error) => {
        console.error("Erreur lors de la vérification du rôle de l'utilisateur :", error);
      });
    } else {
      console.error("Utilisateur non authentifié.");
      window.location.href = "login.html";
    }
  });
}

function loadAllTeams() {
  const teamsRef = ref(db, "teams");
  const teamList = document.getElementById("teamList");
  teamList.innerHTML = ""; // Réinitialiser la liste

  get(teamsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const teams = snapshot.val();

      for (const teamId in teams) {
        const team = teams[teamId];
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>${team.nom}</strong>: ${team.description}
          <a href="manage_team.html?teamId=${teamId}">Gérer cette équipe</a>
        `;
        teamList.appendChild(listItem);
      }
    } else {
      console.log("Aucune équipe trouvée.");
      teamList.innerHTML = "<li>Aucune équipe disponible pour le moment.</li>";
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement des équipes :", error);
  });
}

function loadMemberTeams(userId) {
  const teamsRef = ref(db, "teams");
  const teamList = document.getElementById("teamList");
  teamList.innerHTML = ""; // Réinitialiser la liste

  get(teamsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const teams = snapshot.val();
      let hasTeams = false;

      console.log("Chargement des équipes pour l'utilisateur membre :", userId);

      for (const teamId in teams) {
        const team = teams[teamId];
        const membres = team.membres || {};

        console.log(`Équipe détectée : ${team.nom} (ID : ${teamId})`);

        // Vérifier si l'utilisateur est dans la liste des membres
        for (const memberId in membres) {
          const member = membres[memberId];
          console.log(`Membre détecté dans l'équipe ${team.nom} :`, member);

          if (member.uid === userId) {
            hasTeams = true;
            console.log(`L'utilisateur ${userId} est membre de l'équipe ${team.nom}`);

            const listItem = document.createElement("li");
            listItem.innerHTML = `
              <strong>${team.nom}</strong>: ${team.description}
              <a href="manage_team.html?teamId=${teamId}">Gérer cette équipe</a>
            `;
            teamList.appendChild(listItem);
            break; // Passer à l'équipe suivante dès que l'utilisateur est trouvé
          }
        }
      }

      if (!hasTeams) {
        console.log("Aucune équipe trouvée pour cet utilisateur.");
        teamList.innerHTML = "<li>Vous n'êtes membre d'aucune équipe.</li>";
      }
    } else {
      console.log("Aucune équipe trouvée dans la base de données.");
      teamList.innerHTML = "<li>Aucune équipe disponible pour le moment.</li>";
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement des équipes :", error);
  });
}


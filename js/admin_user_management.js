import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCq0c3FWkfKsO0vj2aGy5jPQt3BLHB3kGY",
  authDomain: "basketball-challenge-v2.firebaseapp.com",
  projectId: "basketball-challenge-v2",
  storageBucket: "basketball-challenge-v2-default-rtdb.europe-west1.firebasestorage.app",
  messagingSenderId: "724994841928",
  appId: "1:724994841928:web:25777e6d448c6527fc277d",
  databaseURL: "https://basketball-challenge-v2-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Vérifier si l'utilisateur est un super-admin
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    const userRoleRef = ref(db, `users/${userId}/role`);

    get(userRoleRef).then((snapshot) => {
      const role = snapshot.val();
      if (role === "super-admin") {
        // Charger les utilisateurs et équipes si le rôle est `super-admin`
        loadUsersAndTeams();
      } else {
        console.error("Accès refusé : Vous n'êtes pas un super-admin.");
      }
    }).catch((error) => {
      console.error("Erreur lors de la vérification du rôle de l'utilisateur :", error);
    });
  } else {
    console.error("Utilisateur non authentifié.");
  }
});

// Fonction pour charger les utilisateurs et leurs équipes
function loadUsersAndTeams() {
  const usersRef = ref(db, "users");
  get(usersRef).then((snapshot) => {
    const users = snapshot.val();
    const userManagementTableBody = document.getElementById("userManagementTableBody");
    userManagementTableBody.innerHTML = "";

    for (const userId in users) {
      const user = users[userId];
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.pseudo || "N/A"}</td>
        <td>${user.email || "N/A"}</td>
        <td>${user.taille || "N/A"}</td>
        <td>${user.poste || "N/A"}</td>
        <td>${user.role || "Utilisateur"}</td>
        <td>
          <ul id="userTeamsList-${userId}"></ul>
        </td>
      `;
      userManagementTableBody.appendChild(row);

      // Charger les équipes et rôles spécifiques de l'utilisateur
      loadUserTeamsAndRoles(userId);
    }
  }).catch((error) => {
    console.error("Erreur lors du chargement des utilisateurs :", error);
  });
}

// Fonction pour charger les équipes et rôles d'un utilisateur
function loadUserTeamsAndRoles(userId) {
  const userTeamsList = document.getElementById(`userTeamsList-${userId}`);
  const teamsRef = ref(db, "teams");

  get(teamsRef).then((snapshot) => {
    const teams = snapshot.val();

    for (const teamId in teams) {
      const team = teams[teamId];
      if (team.membres && team.membres[userId]) {
        const memberRole = team.membres[userId].role || "Membre";

        const teamItem = document.createElement("li");
        teamItem.innerHTML = `
          ${team.nom}: 
          <select onchange="updateUserRoleInTeam('${userId}', '${teamId}', this.value)">
            <option value="membre" ${memberRole === "membre" ? "selected" : ""}>Membre</option>
            <option value="admin" ${memberRole === "admin" ? "selected" : ""}>Admin</option>
          </select>
        `;
        userTeamsList.appendChild(teamItem);
      }
    }
  });
}

// Fonction pour mettre à jour le rôle de l'utilisateur dans une équipe
export function updateUserRoleInTeam(userId, teamId, newRole) {
  const memberRef = ref(db, `teams/${teamId}/membres/${userId}`);
  update(memberRef, { role: newRole }).then(() => {
    console.log(`Rôle mis à jour pour l'utilisateur ${userId} dans l'équipe ${teamId}`);
  }).catch((error) => {
    console.error("Erreur lors de la mise à jour du rôle :", error);
  });
}

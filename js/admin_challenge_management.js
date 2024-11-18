import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get, push, update, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// Vérifier que l'utilisateur est super-admin
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists() && userSnapshot.val().role === "super-admin") {
      // L'utilisateur est super-admin, on charge la liste des challenges
      loadChallenges();
    } else {
      document.getElementById("accessMessage").textContent =
        "Accès refusé. Seul le super-admin peut accéder à cette page.";
    }
  } else {
    window.location.href = "login.html";
  }
});

// Charger la liste des challenges
function loadChallenges() {
  const challengesRef = ref(db, "challenges");
  get(challengesRef)
    .then((snapshot) => {
      const challenges = snapshot.val();
      const challengeTableBody = document.getElementById("challengeTableBody");
      challengeTableBody.innerHTML = "";

      for (const challengeId in challenges) {
        const challengeData = challenges[challengeId];
        const challengeRow = document.createElement("tr");

        challengeRow.innerHTML = `
          <td><input type="text" value="${challengeData.nom || ''}" id="name-${challengeId}"></td>
          <td><textarea id="description-${challengeId}">${challengeData.description || ''}</textarea></td>
          <td><input type="text" value="${challengeData.image || ''}" id="image-${challengeId}"></td>
          <td>
            <select id="status-${challengeId}">
              <option value="actif" ${
                challengeData.statut === "actif" ? "selected" : ""
              }>Actif</option>
              <option value="inactif" ${
                challengeData.statut === "inactif" ? "selected" : ""
              }>Inactif</option>
            </select>
          </td>
          <td><button onclick="saveChallengeChanges('${challengeId}')">Enregistrer</button></td>
        `;

        challengeTableBody.appendChild(challengeRow);
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des challenges :", error);
    });
}

// Gestion de la création de challenge
document.getElementById("createChallengeForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("challengeName").value;
  const description = document.getElementById("challengeDescription").value;
  const image = document.getElementById("challengeImage").value;
  const status = document.getElementById("challengeStatus").value;

  const newChallengeRef = push(ref(db, "challenges"));
  set(newChallengeRef, {
    nom: name,
    description: description,
    image: image,
    statut: status
  })
    .then(() => {
      document.getElementById("createChallengeMessage").textContent =
        "Challenge créé avec succès.";
      loadChallenges();
    })
    .catch((error) => {
      console.error("Erreur lors de la création du challenge :", error);
      document.getElementById("createChallengeMessage").textContent =
        "Erreur lors de la création du challenge.";
    });
});

// Enregistrer les modifications d'un challenge
export function saveChallengeChanges(challengeId) {
  const name = document.getElementById(`name-${challengeId}`).value;
  const description = document.getElementById(`description-${challengeId}`).value;
  const image = document.getElementById(`image-${challengeId}`).value;
  const status = document.getElementById(`status-${challengeId}`).value;

  const challengeRef = ref(db, `challenges/${challengeId}`);
  update(challengeRef, {
    nom: name,
    description: description,
    image: image,
    statut: status
  })
    .then(() => {
      alert("Modifications enregistrées avec succès !");
    })
    .catch((error) => {
      console.error("Erreur lors de la sauvegarde des modifications :", error);
    });
}

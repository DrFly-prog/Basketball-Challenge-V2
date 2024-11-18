import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// Extraire l'ID de l'équipe depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get("teamId");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;

    // Vérifier si l'utilisateur est admin de l'équipe
    const memberRef = ref(db, `teams/${teamId}/membres/${userId}`);
    get(memberRef).then((snapshot) => {
      const memberData = snapshot.val();
      if (memberData && memberData.role === "admin") {
        document.getElementById("addMemberContainer").style.display = "block";
      }
    });

    // Charger les informations de l'équipe
    const teamRef = ref(db, `teams/${teamId}`);
    get(teamRef).then((snapshot) => {
      const teamData = snapshot.val();
      document.getElementById("teamName").textContent = teamData.nom;
      document.getElementById("teamDescription").textContent = teamData.description;

      // Charger la liste des membres de l'équipe
      const membersRef = ref(db, `teams/${teamId}/membres`);
      get(membersRef).then((membersSnapshot) => {
        const members = membersSnapshot.val();
        const teamMembersList = document.getElementById("teamMembersList");

        for (const memberId in members) {
          const member = members[memberId];
          const listItem = document.createElement("li");
          listItem.textContent = `${member.pseudo} (${member.role || 'membre'})`;
          teamMembersList.appendChild(listItem);
        }
      });
    });

    // Ajouter un membre à l'équipe si l'utilisateur est admin
    document.getElementById("addMemberForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const pseudo = document.getElementById("memberPseudo").value;
      const addMemberMessage = document.getElementById("addMemberMessage");

      // Ajouter un nouveau membre avec un pseudo
      const newMemberRef = push(ref(db, `teams/${teamId}/membres`));
      set(newMemberRef, { pseudo: pseudo, role: "membre" })
        .then(() => {
          addMemberMessage.textContent = "Membre ajouté avec succès !";
          addMemberMessage.style.color = "green";
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout du membre :", error);
          addMemberMessage.textContent = "Erreur lors de l'ajout du membre.";
          addMemberMessage.style.color = "red";
        });
    });
  } else {
    window.location.href = "login.html";
  }
});

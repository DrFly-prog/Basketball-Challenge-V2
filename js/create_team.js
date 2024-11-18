import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// Vérifier l'état de connexion de l'utilisateur
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Écoute de la soumission du formulaire
    document.getElementById("createTeamForm").addEventListener("submit", async (event) => {
      event.preventDefault();

      const nom = document.getElementById("nom").value;
      const description = document.getElementById("description").value;
      const messageElement = document.getElementById("teamMessage");

      try {
        // Ajouter une nouvelle équipe à la base de données
        const teamRef = push(ref(db, "teams"));
        await set(teamRef, {
          nom: nom,
          description: description,
          admin: user.uid,
          membres: {
            [user.uid]: { role: "admin" }
          }
        });
        messageElement.textContent = "Équipe créée avec succès !";
        messageElement.style.color = "green";
      } catch (error) {
        console.error("Erreur lors de la création de l'équipe :", error);
        messageElement.textContent = "Erreur : " + error.message;
        messageElement.style.color = "red";
      }
    });
  } else {
    // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
    window.location.href = "login.html";
  }
});

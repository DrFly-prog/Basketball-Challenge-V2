import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Gestion du formulaire d'inscription
document.getElementById("signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const pseudo = document.getElementById("pseudo").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageElement = document.getElementById("signupMessage");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ajouter l'utilisateur dans Realtime Database
    await set(ref(db, 'users/' + user.uid), {
      pseudo: pseudo,
      email: email,
      role: 'membre', // Rôle par défaut
      taille: '',
      poste: ''
    });

    messageElement.textContent = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
    messageElement.style.color = "green";
  } catch (error) {
    messageElement.textContent = error.message;
    messageElement.style.color = "red";
  }
});

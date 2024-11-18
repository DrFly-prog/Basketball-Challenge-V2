import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCq0c3FWkfKsO0vj2aGy5jPQt3BLHB3kGY",
  authDomain: "basketball-challenge-v2.firebaseapp.com",
  projectId: "basketball-challenge-v2",
  storageBucket: "basketball-challenge-v2.firebasestorage.app",
  messagingSenderId: "724994841928",
  appId: "1:724994841928:web:25777e6d448c6527fc277d"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Gestion du formulaire de connexion
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const messageElement = document.getElementById("loginMessage");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    messageElement.textContent = "Connexion réussie !";
    messageElement.style.color = "green";
    // Rediriger vers la page d'accueil ou de profil
    window.location.href = "index.html";
  } catch (error) {
    messageElement.textContent = error.message;
    messageElement.style.color = "red";
  }
});

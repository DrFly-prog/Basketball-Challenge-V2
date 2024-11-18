import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

// Fonction d'inscription
export function signUpUser(email, password, pseudo) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Ajouter l'utilisateur dans Realtime Database
      return set(ref(db, 'users/' + user.uid), {
        pseudo: pseudo,
        email: email,
        role: 'membre', // Rôle par défaut
        taille: '',
        poste: ''
      });
    })
    .catch((error) => {
      console.error("Erreur d'inscription : ", error.message);
      throw error;
    });
}

// Fonction de connexion
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .catch((error) => {
      console.error("Erreur de connexion : ", error.message);
      throw error;
    });
}

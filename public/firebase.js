import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth }         from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
 
  const firebaseConfig = {
    apiKey: "AIzaSyA7b1_-yb9haf5Yy9tTgdbcsAyKxKVv-ew",
    authDomain: "fittogether-kai.firebaseapp.com",
    projectId: "fittogether-kai",
    storageBucket: "fittogether-kai.firebasestorage.app",
    messagingSenderId: "486479209386",
    appId: "1:486479209386:web:351fb651ab5b4c94d981d3"
};
 
const app = initializeApp(firebaseConfig);
 
export const firestore = getFirestore(app);
export const auth      = getAuth(app);
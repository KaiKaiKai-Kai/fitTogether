<script type="module">

import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth }         from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
 
  const firebaseConfig = {
    apiKey: "no",
    authDomain: "no",
    projectId: "no",
    storageBucket: "no",
    messagingSenderId: "no",
    appId: "no"
};
 
const app = initializeApp(firebaseConfig);
 
export const firestore = getFirestore(app);
export const auth      = getAuth(app);
 
</script>

// ── IMPORTS ──
import { auth, firestore }  from "./firebase.js";
import { db }               from "./db.js";
import { menu }             from "./components/menu.js";
import { modals }           from "./components/modals.js";
import { homepage }         from "./components/homepage.js";
import { userDashboard }    from "./components/userDashboard.js";
import { adminDashboard }   from "./components/adminDashboard.js";
import { basicDashboard }   from "./components/basicDashboard.js";
import { friends, mountFriendActions }           from "./components/friends.js";
import { friendProfile }                         from "./components/friendProfile.js";
import { leaderboard, mountLeaderboardActions }  from "./components/leaderboard.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ── PERSISTENT COMPONENTS ──
document.getElementById("menu").innerHTML   = menu();
document.getElementById("modals").innerHTML = modals();

// ── AUTH STATE LISTENER ──
// This fires every time the user logs in, logs out, or the page loads.
// It's the single source of truth for who is logged in.
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is logged in — load their profile from Firestore
    const profile = await db.getProfile(user.uid);
    localStorage.setItem("uid",  user.uid);
    localStorage.setItem("name", profile?.username || user.email.split("@")[0]);
    localStorage.setItem("role", profile?.role     || "user");
    if (!localStorage.getItem("page")) localStorage.setItem("page", "dashboard");
  } else {
    // User logged out — clear everything
    ["uid", "name", "role", "page", "viewingFriend", "leaderboardTab"]
      .forEach(k => localStorage.removeItem(k));
  }
  render();
});

// ── ROUTER ──
export function render() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "";
  const uid  = localStorage.getItem("uid")  || "";
  const page = localStorage.getItem("page") || "dashboard";
  const app  = document.getElementById("app");

  if (!role) {
    app.innerHTML = homepage();
    updateNav(null, "");
    attachModalListeners();
    return;
  }

  switch (page) {
    case "friends":
      app.innerHTML = friends(uid);
      mountFriendActions(uid);
      break;

    case "leaderboard":
      app.innerHTML = leaderboard(uid);
      mountLeaderboardActions();
      break;

    case "friendProfile": {
      const friendId = localStorage.getItem("viewingFriend");
      app.innerHTML = friendProfile(friendId, uid);
      break;
    }

    case "dashboard":
    default:
      switch (role) {
        case "admin": app.innerHTML = adminDashboard(name); break;
        case "user":  app.innerHTML = userDashboard(uid, name);  break;
        case "basic": app.innerHTML = basicDashboard(name); break;
      }
  }

  updateNav(role, name);
  attachModalListeners();
}

// ── NAV ──
function updateNav(role, name) {
  const nav = document.getElementById("nav-links");
  if (!role) {
    nav.innerHTML = `
      <button onclick="openModal('loginModal')"
              style="color:var(--muted);background:none;border:none;cursor:pointer;"
              class="px-4 py-2">Log In</button>
      <button onclick="openModal('registerModal')"
              class="btn-accent px-5 py-2 rounded-lg text-sm">Sign Up</button>`;
    return;
  }
  const showFriends = role === "user" || role === "admin";
  nav.innerHTML = `
    ${showFriends ? `
      <button onclick="navigateTo('friends')"
              class="btn-ghost px-4 py-2 rounded-lg text-sm">👥 Friends</button>
      <button onclick="navigateTo('leaderboard')"
              class="btn-ghost px-4 py-2 rounded-lg text-sm">🏆 Leaderboard</button>` : ""}
    <button onclick="navigateTo('dashboard')"
            class="btn-ghost px-4 py-2 rounded-lg text-sm">🏠 Home</button>
    <span style="color:var(--muted)" class="text-sm self-center mx-1">Hi, ${name}</span>
    <button onclick="logout()" class="btn-ghost px-4 py-2 rounded-lg text-sm">Log Out</button>
  `;
}

// ── MODAL LISTENERS ──
function attachModalListeners() {
  document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.modal));
  });
}

// ── AUTH ──
async function attemptLogin(email, pwd) {
  try {
    await signInWithEmailAndPassword(auth, email, pwd);
    // onAuthStateChanged fires automatically → render() called for you
    closeAllModals();
  } catch {
    showAuthError("loginError", "Wrong email or password.");
  }
}

async function attemptRegister(username, email, pwd, confirmPwd) {
  // Validation
  if (!username || !email || !pwd) {
    showAuthError("regError", "Please fill in all fields.");
    return;
  }
  if (username.length < 3) {
    showAuthError("regError", "Username must be at least 3 characters.");
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showAuthError("regError", "Username: letters, numbers and _ only.");
    return;
  }
  if (pwd.length < 6) {
    showAuthError("regError", "Password must be at least 6 characters.");
    return;
  }
  if (confirmPwd && pwd !== confirmPwd) {
    showAuthError("regError", "Passwords don't match.");
    return;
  }

  try {
    // Create Firebase Auth account
    const cred = await createUserWithEmailAndPassword(auth, email, pwd);

    // Save username + role to Firestore
    await db.createProfile(cred.user.uid, username, "user");

    closeAllModals();
    // onAuthStateChanged fires → render() called automatically
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      showAuthError("regError", "An account with this email already exists.");
    } else {
      showAuthError("regError", e.message);
    }
  }
}

// ── AUTH ERROR HELPERS ──
function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}

// ── MODALS ──
function openModal(id)    { document.getElementById(id)?.classList.remove("hidden"); }
function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
}

document.getElementById("modals").addEventListener("click", e => {
  if (e.target.classList.contains("modal-backdrop")) closeAllModals();
});

// ── NAVIGATION ──
function navigateTo(page) {
  localStorage.setItem("page", page);
  render();
}

// ── EXPOSE GLOBALS ──
window.render         = render;
window.navigateTo     = navigateTo;
window.openModal      = openModal;
window.closeAllModals = closeAllModals;
window.switchToLogin    = () => { closeAllModals(); openModal("loginModal"); };
window.switchToRegister = () => { closeAllModals(); openModal("registerModal"); };

window.logout = async () => {
  await signOut(auth);
  // onAuthStateChanged fires → clears localStorage → render() called
};

// Login — now uses email
window.login = () => attemptLogin(
  document.getElementById("loginEmail").value.trim(),
  document.getElementById("loginPassword").value
);
window.loginInline = () => attemptLogin(
  document.getElementById("inlineEmail").value.trim(),
  document.getElementById("inlinePassword").value
);

// Register — now takes username + email + password
window.register = () => attemptRegister(
  document.getElementById("regUsername").value.trim(),
  document.getElementById("regEmail").value.trim(),
  document.getElementById("regPassword").value,
  document.getElementById("regConfirm").value
);
window.registerInline = () => attemptRegister(
  document.getElementById("inlineRegUsername").value.trim(),
  document.getElementById("inlineRegEmail").value.trim(),
  document.getElementById("inlineRegPassword").value
);
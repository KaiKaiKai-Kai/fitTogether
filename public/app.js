// ── IMPORTS ──
import { menu }           from "./components/menu.js";
import { modals }         from "./components/modals.js";
import { homepage }       from "./components/homepage.js";
import { userDashboard }  from "./components/userDashboard.js";
import { adminDashboard } from "./components/adminDashboard.js";
import { basicDashboard } from "./components/basicDashboard.js";
import { friends, mountFriendActions } from "./components/friends.js";
import { friendProfile }  from "./components/friendProfile.js";
import { leaderboard, mountLeaderboardActions } from "./components/leaderboard.js";

// ── PERSISTENT COMPONENTS ──
document.getElementById("menu").innerHTML   = menu();
document.getElementById("modals").innerHTML = modals();

// ── USER STORE ──
// Hardcoded users are the defaults. Registered users are saved to localStorage
// and merged in on every page load so they survive refreshes.
const USERS_KEY = "fittogether_users";

function loadUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    // Merge: saved registered users override nothing in the defaults,
    // but a registered user can never overwrite a hardcoded account.
    return { ...saved, ...users };  // users comes from users.js (hardcoded)
  } catch {
    return { ...users };
  }
}

function saveRegisteredUser(id, entry) {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    saved[id] = entry;
    localStorage.setItem(USERS_KEY, JSON.stringify(saved));
  } catch (e) {
    console.error("Failed to save user:", e);
  }
}

function deleteRegisteredUser(id) {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    delete saved[id];
    localStorage.setItem(USERS_KEY, JSON.stringify(saved));
  } catch (e) {
    console.error("Failed to delete user:", e);
  }
}

// Merged user table — rebuilt on every load
let allUsers = loadUsers();

// ── ROUTER ──
export function render() {
  // Rebuild user table on every render so new registrations are always visible
  allUsers = loadUsers();
  window.allUsers = allUsers; // keep window reference in sync

  const role  = localStorage.getItem("role");
  const name  = localStorage.getItem("name") || "";
  const page  = localStorage.getItem("page") || "dashboard";
  const app   = document.getElementById("app");

  if (!role) {
    app.innerHTML = homepage();
    updateNav(null, "");
    attachModalListeners();
    return;
  }

  switch (page) {
    case "friends":
      app.innerHTML = friends(name);
      mountFriendActions(name);
      break;

    case "leaderboard":
      app.innerHTML = leaderboard(name);
      mountLeaderboardActions();
      break;

    case "friendProfile": {
      const friendId = localStorage.getItem("viewingFriend");
      app.innerHTML = friendProfile(friendId, name);
      break;
    }

    case "dashboard":
    default:
      switch (role) {
        case "admin": app.innerHTML = adminDashboard(name); break;
        case "user":  app.innerHTML = userDashboard(name);  break;
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
              class="btn-ghost px-4 py-2 rounded-lg text-sm">👥 Friends</button>` : ""}
    ${showFriends ? `
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
function attemptLogin(id, pwd) {
  const user = allUsers[id];
  if (!user)              { showAuthError("loginError", `No account found for "${id}".`);  return; }
  if (user.password !== pwd) { showAuthError("loginError", "Wrong password.");             return; }

  hideAuthError("loginError");
  localStorage.setItem("role", user.role);
  localStorage.setItem("name", id);
  localStorage.setItem("page", "dashboard");
  closeAllModals();
  render();
}

function attemptRegister(id, pwd, confirmPwd) {
  // Validation
  if (!id || !pwd)           { showAuthError("regError", "Please fill in all fields.");          return; }
  if (id.length < 3)         { showAuthError("regError", "Username must be at least 3 chars.");  return; }
  if (!/^[a-zA-Z0-9_]+$/.test(id)) { showAuthError("regError", "Username: letters, numbers, _ only."); return; }
  if (pwd.length < 4)        { showAuthError("regError", "Password must be at least 4 chars.");  return; }
  if (confirmPwd !== undefined && pwd !== confirmPwd) {
    showAuthError("regError", "Passwords don't match.");
    return;
  }
  if (allUsers[id])          { showAuthError("regError", `Username "${id}" is already taken.`);  return; }

  // Save new user
  const newUser = { password: pwd, role: "user", name: id };
  saveRegisteredUser(id, newUser);
  allUsers[id] = newUser; // update in-memory table immediately

  hideAuthError("regError");
  localStorage.setItem("role", "user");
  localStorage.setItem("name", id);
  localStorage.setItem("page", "dashboard");
  closeAllModals();
  render();
}

// ── AUTH ERROR HELPERS ──
function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}
function hideAuthError(id) {
  document.getElementById(id)?.classList.add("hidden");
}

// ── MODALS ──
function openModal(id)    { document.getElementById(id)?.classList.remove("hidden"); }
function closeAllModals() { document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden")); }

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
window.allUsers       = allUsers; // leaderboard + friends can read this
window.switchToLogin    = () => { closeAllModals(); openModal("loginModal"); };
window.switchToRegister = () => { closeAllModals(); openModal("registerModal"); };

window.logout = () => {
  ["role", "name", "page", "viewingFriend"].forEach(k => localStorage.removeItem(k));
  render();
};

// Login forms
window.login = () => attemptLogin(
  document.getElementById("loginId").value.trim().toLowerCase(),
  document.getElementById("loginPassword").value
);
window.loginInline = () => attemptLogin(
  document.getElementById("inlineId").value.trim().toLowerCase(),
  document.getElementById("inlinePassword").value
);

// Register forms (modal has a confirm field, inline does not)
window.register = () => attemptRegister(
  document.getElementById("regId").value.trim().toLowerCase(),
  document.getElementById("regPassword").value,
  document.getElementById("regConfirm")?.value
);
window.registerInline = () => attemptRegister(
  document.getElementById("inlineRegId").value.trim().toLowerCase(),
  document.getElementById("inlineRegPassword").value
);

// ── INIT ──
render();
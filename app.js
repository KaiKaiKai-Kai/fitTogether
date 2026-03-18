// ── IMPORTS ──
// To add a new page: create the component, import it here, add a case in render()
import { menu }           from "./components/menu.js";
import { modals }         from "./components/modals.js";
import { homepage }       from "./components/homepage.js";
import { userDashboard }  from "./components/userDashboard.js";
import { adminDashboard } from "./components/adminDashboard.js";
import { basicDashboard } from "./components/basicDashboard.js";
 
// ── INJECT PERSISTENT COMPONENTS ──
document.getElementById("menu").innerHTML   = menu();
document.getElementById("modals").innerHTML = modals();
 
// ── ROUTER ──
// Add a new role/page by adding a case here
export function render() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "";
  const app  = document.getElementById("app");
 
  switch (role) {
    case "admin": app.innerHTML = adminDashboard(name); break;
    case "user":  app.innerHTML = userDashboard(name);  break;
    case "basic": app.innerHTML = basicDashboard(name); break;
    default:      app.innerHTML = homepage();           break;
  }
 
  updateNav(role, name);
  attachModalListeners();
}
 
// ── NAV ──
function updateNav(role, name) {
  const nav = document.getElementById("nav-links");
  nav.innerHTML = role
    ? `<span style="color:var(--muted)" class="text-sm self-center mr-2">Hi, ${name}</span>
       <button onclick="logout()" class="btn-ghost px-4 py-2 rounded-lg text-sm">Log Out</button>`
    : `<button onclick="openModal('loginModal')" style="color:var(--muted);background:none;border:none;cursor:pointer;" class="px-4 py-2">Log In</button>
       <button onclick="openModal('registerModal')" class="btn-accent px-5 py-2 rounded-lg text-sm">Sign Up</button>`;
}
 
// ── MODAL LISTENERS ──
// Re-attached after every render so dynamically injected buttons always work
function attachModalListeners() {
  document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.modal));
  });
}
 
// ── AUTH ──
function attemptLogin(id, pwd) {
  const user = users[id];
  if (user && user.password === pwd) {
    localStorage.setItem("role", user.role);
    localStorage.setItem("name", user.name);
    closeAllModals();
    render();
  } else {
    alert("Wrong username or password.");
  }
}
 
function attemptRegister(id, pwd) {
  if (!id || !pwd)  { alert("Please fill in all fields."); return; }
  if (users[id])    { alert("Username already taken."); return; }
  users[id] = { password: pwd, role: "basic", name: id };
  localStorage.setItem("role", "basic");
  localStorage.setItem("name", id);
  closeAllModals();
  render();
}
 
// ── MODALS ──
function openModal(id)    { document.getElementById(id)?.classList.remove("hidden"); }
function closeAllModals() { document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden")); }
 
// Close on backdrop click
document.getElementById("modals").addEventListener("click", e => {
  if (e.target.classList.contains("modal-backdrop")) closeAllModals();
});
 
// ── EXPOSE GLOBALS ──
// These are called from inline onclick handlers inside component HTML strings
window.render         = render;
window.logout         = () => { localStorage.removeItem("role"); localStorage.removeItem("name"); render(); };
window.openModal      = openModal;
window.closeAllModals = closeAllModals;
window.switchToLogin    = () => { closeAllModals(); openModal("loginModal"); };
window.switchToRegister = () => { closeAllModals(); openModal("registerModal"); };
 
window.login = () => {
  attemptLogin(
    document.getElementById("loginId").value.trim(),
    document.getElementById("loginPassword").value
  );
};
window.register = () => {
  attemptRegister(
    document.getElementById("regId").value.trim(),
    document.getElementById("regPassword").value
  );
};
window.loginInline = () => {
  attemptLogin(
    document.getElementById("inlineId").value.trim(),
    document.getElementById("inlinePassword").value
  );
};
window.registerInline = () => {
  attemptRegister(
    document.getElementById("inlineRegId").value.trim(),
    document.getElementById("inlineRegPassword").value
  );
};
 
// ── INIT ──
render();
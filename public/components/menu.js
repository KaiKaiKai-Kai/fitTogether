export function menu() {
  return `
    <style>
      #nav-links        { display: flex; gap: 8px; align-items: center; }
      #hamburger-btn    { display: none; }
      #mobile-menu      { display: none; }

      @media (max-width: 640px) {
        #nav-links      { display: none !important; }
        #hamburger-btn  { display: flex; }
      }
    </style>

    <div style="background:#141414; border-bottom:1px solid #222; position:sticky; top:0; z-index:100;">
      <div style="padding:16px 24px; display:flex; align-items:center; justify-content:space-between;">

        <!-- Logo -->
        <span class="bebas text-2xl" style="color:var(--accent); cursor:pointer"
              onclick="navigateTo('dashboard')">FitTogether</span>

        <!-- Desktop nav -->
        <div id="nav-links"></div>

        <!-- Hamburger button -->
        <button id="hamburger-btn"
                onclick="toggleMobileMenu()"
                style="background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;justify-content:center;gap:5px;width:32px;height:32px;">
          <span id="ham-1" style="display:block;height:2px;width:100%;background:var(--text);border-radius:2px;transition:all 0.25s;transform-origin:center;"></span>
          <span id="ham-2" style="display:block;height:2px;width:100%;background:var(--text);border-radius:2px;transition:opacity 0.25s;"></span>
          <span id="ham-3" style="display:block;height:2px;width:100%;background:var(--text);border-radius:2px;transition:all 0.25s;transform-origin:center;"></span>
        </button>

      </div>

      <!-- Mobile dropdown -->
      <div id="mobile-menu"
           style="border-top:1px solid #222; background:#141414; padding:8px 16px 16px;">
        <div id="mobile-nav-links" style="display:flex; flex-direction:column; gap:4px;"></div>
      </div>
    </div>
  `;
}

// ── MOBILE MENU TOGGLE ──
window.toggleMobileMenu = () => {
  const mobileMenu = document.getElementById("mobile-menu");
  const isOpen     = mobileMenu.style.display === "block";

  mobileMenu.style.display = isOpen ? "none" : "block";

  // Animate hamburger → X
  const h1 = document.getElementById("ham-1");
  const h2 = document.getElementById("ham-2");
  const h3 = document.getElementById("ham-3");

  if (!isOpen) {
    h1.style.transform = "translateY(7px) rotate(45deg)";
    h2.style.opacity   = "0";
    h3.style.transform = "translateY(-7px) rotate(-45deg)";
  } else {
    h1.style.transform = "";
    h2.style.opacity   = "1";
    h3.style.transform = "";
  }
};

// Close when clicking outside
document.addEventListener("click", e => {
  const mobileMenu = document.getElementById("mobile-menu");
  const btn        = document.getElementById("hamburger-btn");
  if (!mobileMenu || !btn) return;
  if (mobileMenu.style.display !== "block") return;
  if (!mobileMenu.contains(e.target) && !btn.contains(e.target)) {
    mobileMenu.style.display = "none";
    document.getElementById("ham-1").style.transform = "";
    document.getElementById("ham-2").style.opacity   = "1";
    document.getElementById("ham-3").style.transform = "";
  }
});

// Close and reset hamburger icon (called from nav buttons)
window.closeMobileMenu = () => {
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenu) mobileMenu.style.display = "none";
  const h1 = document.getElementById("ham-1");
  const h2 = document.getElementById("ham-2");
  const h3 = document.getElementById("ham-3");
  if (h1) h1.style.transform = "";
  if (h2) h2.style.opacity   = "1";
  if (h3) h3.style.transform = "";
};
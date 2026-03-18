export function modals() {
  return `
    <!-- LOGIN MODAL -->
    <div id="loginModal" class="modal-backdrop hidden">
      <div class="dark-card p-8 w-full max-w-sm fade-up">
        <div class="flex justify-between items-center mb-6">
          <h2 class="bebas text-3xl" style="color:var(--accent)">Log In</h2>
          <button onclick="closeAllModals()"
                  style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.2rem">✕</button>
        </div>
        <div class="flex flex-col gap-4">
          <input class="fit-input" id="loginId" placeholder="Username" />
          <input class="fit-input" id="loginPassword" type="password" placeholder="Password" />
          <button class="btn-accent px-6 py-3 rounded-lg w-full" onclick="login()">Log In</button>
        </div>
        <p class="text-center text-sm mt-4" style="color:var(--muted)">
          No account?
          <span class="cursor-pointer underline" style="color:var(--accent)"
                onclick="switchToRegister()">Sign up</span>
        </p>
      </div>
    </div>
 
    <!-- REGISTER MODAL -->
    <div id="registerModal" class="modal-backdrop hidden">
      <div class="dark-card p-8 w-full max-w-sm fade-up">
        <div class="flex justify-between items-center mb-6">
          <h2 class="bebas text-3xl" style="color:var(--accent)">Sign Up</h2>
          <button onclick="closeAllModals()"
                  style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.2rem">✕</button>
        </div>
        <div class="flex flex-col gap-4">
          <input class="fit-input" id="regId" placeholder="Choose a username" />
          <input class="fit-input" id="regPassword" type="password" placeholder="Choose a password" />
          <button class="btn-accent px-6 py-3 rounded-lg w-full" onclick="register()">Create Account</button>
        </div>
        <p class="text-center text-sm mt-4" style="color:var(--muted)">
          Have an account?
          <span class="cursor-pointer underline" style="color:var(--accent)"
                onclick="switchToLogin()">Log in</span>
        </p>
      </div>
    </div>
  `;
}
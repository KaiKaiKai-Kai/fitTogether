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
          <input class="fit-input" id="loginEmail" type="email"
                 placeholder="Email" autocomplete="email" />
          <input class="fit-input" id="loginPassword" type="password"
                 placeholder="Password" autocomplete="current-password" />
          <p id="loginError" class="text-sm hidden" style="color:#f87171"></p>
          <button class="btn-accent px-6 py-3 rounded-lg w-full" onclick="login()">
            Log In
          </button>
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
          <h2 class="bebas text-3xl" style="color:var(--accent)">Create Account</h2>
          <button onclick="closeAllModals()"
                  style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.2rem">✕</button>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <input class="fit-input" id="regUsername"
                   placeholder="Username (letters, numbers, _)"
                   autocomplete="username" />
            <p class="text-xs mt-1" style="color:var(--muted)">Min. 3 characters, shown to other users</p>
          </div>
          <input class="fit-input" id="regEmail" type="email"
                 placeholder="Email" autocomplete="email" />
          <input class="fit-input" id="regPassword" type="password"
                 placeholder="Password (min. 6 chars)" autocomplete="new-password" />
          <input class="fit-input" id="regConfirm" type="password"
                 placeholder="Confirm password" autocomplete="new-password" />
          <p id="regError" class="text-sm hidden" style="color:#f87171"></p>
          <button class="btn-accent px-6 py-3 rounded-lg w-full" onclick="register()">
            Create Account
          </button>
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
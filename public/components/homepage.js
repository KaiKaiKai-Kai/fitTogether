export function homepage() {
  return `
    <div>
      <!-- Hero -->
      <div style="background:linear-gradient(135deg,#141414 0%,#1e2a0e 100%);border-bottom:1px solid #2a2a2a;"
           class="px-6 py-28 text-center">
        <p class="fade-up text-sm font-medium mb-4 tracking-widest uppercase"
           style="color:var(--accent)">Your fitness. Your community.</p>
        <h1 class="fade-up-2 bebas text-8xl md:text-9xl mb-6" style="line-height:0.9">
          Fit<br><span style="color:var(--accent)">Together</span>
        </h1>
        <p class="fade-up-3 text-lg mb-10 max-w-md mx-auto" style="color:var(--muted)">
          Track workouts, connect with friends, and crush your goals — all in one place.
        </p>
        <div class="fade-up-4 flex gap-4 justify-center flex-wrap">
          <button class="btn-accent px-8 py-4 rounded-xl text-lg"
                  onclick="openModal('loginModal')">Log In</button>
          <button class="btn-ghost px-8 py-4 rounded-xl text-lg"
                  onclick="openModal('registerModal')">Create Account</button>
        </div>
      </div>

      <!-- Features -->
      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 px-6 py-16">
        <div class="dark-card p-7 fade-up">
          <div class="text-4xl mb-4">🏃</div>
          <h3 class="bebas text-2xl mb-2" style="color:var(--accent)">Track Workouts</h3>
          <p style="color:var(--muted)" class="text-sm leading-relaxed">
            Log every run, lift, and session. See your effort add up over time.
          </p>
        </div>
        <div class="dark-card p-7 fade-up-2">
          <div class="text-4xl mb-4">👥</div>
          <h3 class="bebas text-2xl mb-2" style="color:var(--accent)">Find Friends</h3>
          <p style="color:var(--muted)" class="text-sm leading-relaxed">
            Connect with people who push as hard as you do. Compete. Motivate.
          </p>
        </div>
        <div class="dark-card p-7 fade-up-3">
          <div class="text-4xl mb-4">📈</div>
          <h3 class="bebas text-2xl mb-2" style="color:var(--accent)">See Progress</h3>
          <p style="color:var(--muted)" class="text-sm leading-relaxed">
            Visualise your stats, celebrate milestones, and keep the streak alive.
          </p>
        </div>
      </div>

      <!-- CTA strip -->
      <div class="max-w-xl mx-auto px-6 pb-20 text-center fade-up">
        <div class="dark-card p-10">
          <h2 class="bebas text-3xl mb-3" style="color:var(--accent)">Ready to start?</h2>
          <p style="color:var(--muted)" class="text-sm mb-6">
            Join FitTogether and start tracking your fitness journey today.
          </p>
          <div class="flex gap-3 justify-center flex-wrap">
            <button class="btn-accent px-8 py-3 rounded-xl"
                    onclick="openModal('registerModal')">Create Free Account</button>
            <button class="btn-ghost px-8 py-3 rounded-xl"
                    onclick="openModal('loginModal')">Log In</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
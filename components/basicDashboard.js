export function basicDashboard(name) {
  return `
    <div class="flex flex-col items-center justify-center px-4 fade-up"
         style="min-height: calc(100vh - 64px)">
      <div class="dark-card p-12 text-center max-w-md">
        <p class="text-5xl mb-4">👋</p>
        <h2 class="bebas text-4xl mb-3">
          Hey, <span style="color:var(--accent)">${name}</span>
        </h2>
        <p style="color:var(--muted)" class="mb-8 leading-relaxed">
          You're on the basic plan. Upgrade to track workouts,
          view stats, and connect with the community.
        </p>
        <button class="btn-accent px-8 py-3 rounded-xl text-base w-full">
          Upgrade Account
        </button>
      </div>
    </div>
  `;
}
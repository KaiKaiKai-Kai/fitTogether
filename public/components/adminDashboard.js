export function adminDashboard(name) {
  const userRows = Object.entries(users).map(([id, u]) => `
    <li class="py-3 flex justify-between items-center">
      <div>
        <p class="font-medium">${u.name}</p>
        <p class="text-sm" style="color:var(--muted)">@${id}</p>
      </div>
      <span style="background:#1e2a0e;color:var(--accent);"
            class="text-xs px-3 py-1 rounded-full uppercase tracking-wide">${u.role}</span>
    </li>
  `).join('');
 
  return `
    <div class="max-w-4xl mx-auto px-4 py-10 fade-up">
 
      <!-- Banner -->
      <div style="background:linear-gradient(135deg,#1a1535,#141414);border:1px solid #2a2a2a;"
           class="rounded-2xl p-8 mb-6">
        <h2 class="bebas text-4xl mb-1">
          Admin Panel — <span style="color:var(--accent)">${name}</span>
        </h2>
        <p style="color:var(--muted)">Full access. Manage users and platform settings.</p>
      </div>
 
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="dark-card p-6 text-center">
          <p class="bebas text-5xl" style="color:var(--accent)">${Object.keys(users).length}</p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Total Users</p>
        </div>
        <div class="dark-card p-6 text-center">
          <p class="bebas text-5xl" style="color:var(--accent)">
            ${Object.values(users).filter(u => u.role === 'user').length}
          </p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Members</p>
        </div>
        <div class="dark-card p-6 text-center">
          <p class="bebas text-5xl" style="color:var(--accent)">
            ${Object.values(users).filter(u => u.role === 'basic').length}
          </p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Basic Users</p>
        </div>
      </div>
 
      <!-- User list -->
      <div class="dark-card p-6">
        <h3 class="bebas text-2xl mb-4">All Users</h3>
        <ul class="divide-y divide-gray-800">${userRows}</ul>
      </div>
    </div>
  `;
}
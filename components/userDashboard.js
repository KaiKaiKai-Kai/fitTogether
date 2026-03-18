export function userDashboard(name) {
  return `
    <div class="max-w-4xl mx-auto px-4 py-10 fade-up">
 
      <!-- Welcome banner -->
      <div style="background:linear-gradient(135deg,#1e2a0e,#141414);border:1px solid #2a2a2a;"
           class="rounded-2xl p-8 mb-6">
        <h2 class="bebas text-4xl mb-1">
          Welcome back, <span style="color:var(--accent)">${name}</span> 💪
        </h2>
        <p style="color:var(--muted)">Here's your fitness summary for today.</p>
      </div>
 
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="dark-card p-6 text-center fade-up">
          <p class="bebas text-5xl" style="color:var(--accent)">8,240</p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Steps Today</p>
        </div>
        <div class="dark-card p-6 text-center fade-up-2">
          <p class="bebas text-5xl" style="color:var(--accent)">430</p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Calories Burned</p>
        </div>
        <div class="dark-card p-6 text-center fade-up-3">
          <p class="bebas text-5xl" style="color:var(--accent)">3</p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Workouts This Week</p>
        </div>
      </div>
 
      <!-- Recent activity -->
      <div class="dark-card p-6">
        <h3 class="bebas text-2xl mb-4">Recent Activity</h3>
        <ul class="divide-y divide-gray-800">
          <li class="py-4 flex justify-between items-center">
            <div>
              <p class="font-medium">Morning Run</p>
              <p class="text-sm" style="color:var(--muted)">Today, 7:00 AM</p>
            </div>
            <span style="background:#1e2a0e;color:var(--accent);"
                  class="text-sm px-3 py-1 rounded-full">5.2 km</span>
          </li>
          <li class="py-4 flex justify-between items-center">
            <div>
              <p class="font-medium">Strength Training</p>
              <p class="text-sm" style="color:var(--muted)">Yesterday, 6:30 PM</p>
            </div>
            <span style="background:#1a2035;color:#60a5fa;"
                  class="text-sm px-3 py-1 rounded-full">45 min</span>
          </li>
          <li class="py-4 flex justify-between items-center">
            <div>
              <p class="font-medium">Yoga Session</p>
              <p class="text-sm" style="color:var(--muted)">Mon, 8:00 AM</p>
            </div>
            <span style="background:#1e1535;color:#a78bfa;"
                  class="text-sm px-3 py-1 rounded-full">30 min</span>
          </li>
        </ul>
      </div>
    </div>
  `;
}
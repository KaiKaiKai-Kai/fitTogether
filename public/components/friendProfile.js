import { db } from "../db.js";

export async function friendProfile(friendUid, viewerUid) {
  const profile = await db.getFriendProfile(friendUid);

  if (!profile) {
    return `
      <div class="max-w-2xl mx-auto px-4 py-20 text-center fade-up">
        <p class="text-5xl mb-4">🔍</p>
        <h2 class="bebas text-3xl mb-2" style="color:var(--accent)">Profile Not Found</h2>
        <p style="color:var(--muted)" class="mb-6">This user hasn't logged any data yet.</p>
        <button onclick="navigateTo('friends')" class="btn-ghost px-6 py-2 rounded-lg">
          ← Back to Friends
        </button>
      </div>
    `;
  }

  // Get the username from all profiles
  const allProfiles  = await db.getAllProfiles();
  const friendData   = allProfiles[friendUid];
  const displayName  = friendData?.username || friendUid.slice(0, 8);

  const today        = new Date().toISOString().split("T")[0];
  const allLogs      = profile.logs;
  const todayLog     = allLogs[today] || {
    steps: 0, calories: 0, heartRate: 0, water: 0, workouts: [], mood: ""
  };

  // Weekly workouts
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekWorkouts = Object.entries(allLogs)
    .filter(([d]) => new Date(d) >= weekStart)
    .reduce((sum, [, l]) => sum + (l.workouts?.length || 0), 0);

  // All-time stats
  const allWorkouts = Object.values(allLogs)
    .reduce((sum, l) => sum + (l.workouts?.length || 0), 0);
  const totalSteps  = Object.values(allLogs)
    .reduce((sum, l) => sum + (l.steps || 0), 0);
  const activeDays  = Object.keys(allLogs).filter(d =>
    allLogs[d].workouts?.length > 0 || allLogs[d].steps > 0
  ).length;

  // Recent workouts — last 5 across all days, read-only
  const recentWorkouts = Object.entries(allLogs)
    .sort(([a], [b]) => b.localeCompare(a))
    .flatMap(([date, l]) => (l.workouts || []).map(w => ({ ...w, date })))
    .slice(0, 5);

  const recentHTML = recentWorkouts.length
    ? recentWorkouts.map(w => `
        <li class="py-4 flex justify-between items-center">
          <div>
            <p class="font-medium">${w.type}</p>
            <p class="text-sm" style="color:var(--muted)">${w.date === today ? "Today" : w.date}</p>
          </div>
          <span style="background:#1e2a0e;color:var(--accent);" class="text-sm px-3 py-1 rounded-full">
            ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}${w.heartRate ? ` · ❤️ ${w.heartRate} bpm` : ""}
          </span>
        </li>`).join("")
    : `<li class="py-4 text-sm text-center" style="color:var(--muted)">No workouts logged yet.</li>`;

  return `
    <div class="max-w-3xl mx-auto px-4 py-10 fade-up">

      <button onclick="navigateTo('friends')"
              class="btn-ghost px-4 py-2 rounded-lg text-sm mb-6">
        ← Back to Friends
      </button>

      <!-- Profile header -->
      <div style="background:linear-gradient(135deg,#1e2a0e,#141414);border:1px solid #2a2a2a;"
           class="rounded-2xl p-8 mb-6 flex items-center gap-6">
        <div class="bebas text-4xl flex items-center justify-center rounded-full flex-shrink-0"
             style="width:72px;height:72px;background:var(--accent);color:#0f0f0f">
          ${displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 class="bebas text-4xl mb-1">${displayName}</h2>
          <p style="color:var(--muted)" class="text-sm">
            ${todayLog.mood ? `Feeling ${todayLog.mood} today` : "No mood update today"}
          </p>
          <span style="background:#1a2a0e;color:var(--accent);font-size:0.7rem;"
                class="px-2 py-1 rounded mt-2 inline-block uppercase tracking-widest">
            👁 View Only
          </span>
        </div>
      </div>

      <!-- Today's stats -->
      <h3 class="bebas text-xl mb-3" style="color:var(--muted)">Today</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="dark-card p-5 text-center">
          <p class="bebas text-4xl" style="color:var(--accent)">
            ${todayLog.steps > 0 ? todayLog.steps.toLocaleString() : "—"}
          </p>
          <p class="text-xs mt-1" style="color:var(--muted)">Steps</p>
        </div>
        <div class="dark-card p-5 text-center">
          <p class="bebas text-4xl" style="color:var(--accent)">
            ${todayLog.calories > 0 ? todayLog.calories : "—"}
          </p>
          <p class="text-xs mt-1" style="color:var(--muted)">Calories</p>
        </div>
        <div class="dark-card p-5 text-center">
          <p class="bebas text-4xl" style="color:var(--accent)">
            ${todayLog.heartRate > 0 ? todayLog.heartRate + " bpm" : "—"}
          </p>
          <p class="text-xs mt-1" style="color:var(--muted)">Avg Heart Rate</p>
        </div>
        <div class="dark-card p-5 text-center">
          <p class="bebas text-4xl" style="color:var(--accent)">
            ${todayLog.workouts?.length || 0}
          </p>
          <p class="text-xs mt-1" style="color:var(--muted)">Workouts Today</p>
        </div>
      </div>

      <!-- All-time stats -->
      <h3 class="bebas text-xl mb-3" style="color:var(--muted)">All Time</h3>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="dark-card p-5 text-center">
          <p class="bebas text-4xl" style="color:var(--accent)">${allWorkouts}</p>
          <p class="text-xs mt-1" style="color:var(--muted)">Total Workouts</p>
        </div>
        <div class="dark-card p-5 text-center">
          <p class="bebas text-4xl" style="color:var(--accent)">
            ${totalSteps > 0 ? (totalSteps / 1000).toFixed(1) + "k" : "—"}
          </p>
          <p class="text-xs mt-1" style="color:var(--muted)">Total Steps</p>
        </div>
        <div class="dark-card p-5 text-center">
          <p class="bebas text-4xl" style="color:var(--accent)">${activeDays}</p>
          <p class="text-xs mt-1" style="color:var(--muted)">Active Days</p>
        </div>
      </div>

      <!-- Recent activity — read only, no remove buttons -->
      <div class="dark-card p-6">
        <h3 class="bebas text-2xl mb-4">Recent Activity</h3>
        <ul class="divide-y divide-gray-800">${recentHTML}</ul>
      </div>

    </div>
  `;
}
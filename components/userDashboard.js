import { db } from "../db.js";
import { mountTrackerActions } from "./tracker.js";
 
export function userDashboard(name) {
  setTimeout(() => mountTrackerActions(name), 0);
 
  const log = db.getLog(name);
  const allLogs = db.getAllLogs(name);
  const workoutsThisWeek = countWorkoutsThisWeek(allLogs);
 
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
 
      <!-- Stats grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
 
        <div class="dark-card p-6 text-center fade-up">
          <p class="bebas text-5xl" style="color:var(--accent)" id="stat-steps">
            ${log.steps > 0 ? log.steps.toLocaleString() : "—"}
          </p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Steps Today</p>
        </div>
 
        <div class="dark-card p-6 text-center fade-up-2">
          <p class="bebas text-5xl" style="color:var(--accent)" id="stat-calories">
            ${log.calories > 0 ? log.calories : "—"}
          </p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Calories Burned</p>
        </div>
 
        <div class="dark-card p-6 text-center fade-up-3">
          <p class="bebas text-5xl" style="color:var(--accent)" id="stat-workouts">
            ${workoutsThisWeek}
          </p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Workouts This Week</p>
        </div>
 
        <!-- Add data card -->
        <div class="dark-card p-6 text-center fade-up-4 cursor-pointer
                    hover:border-[var(--accent)] transition-colors"
             style="border:1px solid #2a2a2a;"
             onclick="openTrackerModal()">
          <p class="bebas text-5xl" style="color:var(--accent)">+</p>
          <p style="color:var(--muted)" class="mt-1 text-sm">Add Your Data</p>
        </div>
 
      </div>
 
      <!-- Recent activity -->
      <div class="dark-card p-6" id="recent-activity">
        <h3 class="bebas text-2xl mb-4">Recent Activity</h3>
        <ul class="divide-y divide-gray-800" id="activity-list">
          ${renderActivityList(log, allLogs)}
        </ul>
      </div>
 
    </div>
 
    <!-- ── TRACKER MODAL ── -->
    <div id="trackerModal" class="modal-backdrop hidden">
      <div class="dark-card w-full max-w-2xl mx-4 fade-up"
           style="max-height:90vh; overflow-y:auto;">
 
        <!-- Modal header -->
        <div class="flex justify-between items-center p-6"
             style="border-bottom:1px solid #2a2a2a; position:sticky; top:0; background:var(--card); z-index:10;">
          <div>
            <h2 class="bebas text-3xl" style="color:var(--accent)">Today's Log</h2>
            <p class="text-sm" style="color:var(--muted)">${new Date().toISOString().split("T")[0]}</p>
          </div>
          <div class="flex gap-2 items-center">
            <button onclick="exportData()" class="btn-ghost px-3 py-1 rounded-lg text-xs">⬇ Export</button>
            <label class="btn-ghost px-3 py-1 rounded-lg text-xs cursor-pointer">
              ⬆ Import
              <input type="file" accept=".json" onchange="importData(event)" style="display:none">
            </label>
            <button onclick="closeTrackerModal()"
                    style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.2rem;margin-left:8px">✕</button>
          </div>
        </div>
 
        <div class="p-6 flex flex-col gap-5">
 
          <!-- Steps, Calories, Water -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="dark-card p-5" style="border-color:#333">
              <p class="text-sm mb-2" style="color:var(--muted)">Steps</p>
              <input id="field-steps" type="number" min="0" class="fit-input"
                     style="font-size:1.4rem;font-family:'Bebas Neue',sans-serif;"
                     value="${log.steps}"
                     oninput="updateField('steps', this.value)" />
            </div>
            <div class="dark-card p-5" style="border-color:#333">
              <p class="text-sm mb-2" style="color:var(--muted)">Calories Burned</p>
              <input id="field-calories" type="number" min="0" class="fit-input"
                     style="font-size:1.4rem;font-family:'Bebas Neue',sans-serif;"
                     value="${log.calories}"
                     oninput="updateField('calories', this.value)" />
            </div>
            <div class="dark-card p-5" style="border-color:#333">
              <p class="text-sm mb-2" style="color:var(--muted)">Water (glasses)</p>
              <div class="flex items-center gap-3 mt-1">
                <button onclick="adjustWater(-1)"
                        style="background:#222;border:1px solid #333;color:var(--text);cursor:pointer;width:36px;height:36px;border-radius:8px;font-size:1.2rem">−</button>
                <span id="water-count" class="bebas text-3xl" style="color:var(--accent)">${log.water}</span>
                <button onclick="adjustWater(1)"
                        style="background:#222;border:1px solid #333;color:var(--text);cursor:pointer;width:36px;height:36px;border-radius:8px;font-size:1.2rem">+</button>
              </div>
            </div>
          </div>
 
          <!-- Mood -->
          <div class="dark-card p-5" style="border-color:#333">
            <p class="text-sm mb-3" style="color:var(--muted)">How are you feeling?</p>
            <div class="flex flex-wrap gap-2" id="mood-buttons">
              ${renderMoodButtons(log.mood)}
            </div>
          </div>
 
          <!-- Log a workout -->
          <div class="dark-card p-5" style="border-color:#333">
            <h3 class="bebas text-xl mb-4">Log a Workout</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <select id="workout-type" class="fit-input">
                <option value="">Type of workout</option>
                <option>Run</option>
                <option>Walk</option>
                <option>Cycling</option>
                <option>Strength Training</option>
                <option>HIIT</option>
                <option>Yoga</option>
                <option>Swimming</option>
                <option>Other</option>
              </select>
              <input id="workout-duration" type="number" min="1"
                     class="fit-input" placeholder="Duration (min)" />
              <input id="workout-distance" type="number" min="0" step="0.1"
                     class="fit-input" placeholder="Distance in km (optional)" />
              <input id="workout-notes" type="text"
                     class="fit-input" placeholder="Notes (optional)" />
            </div>
            <button onclick="addWorkout()" class="btn-accent px-5 py-2 rounded-lg text-sm">
              + Add Workout
            </button>
            <ul id="workout-list" class="divide-y divide-gray-800 mt-4">
              ${renderWorkoutRows(log.workouts)}
            </ul>
          </div>
 
          <!-- Notes -->
          <div class="dark-card p-5" style="border-color:#333">
            <h3 class="bebas text-xl mb-3">Notes</h3>
            <textarea id="field-notes" class="fit-input" rows="3"
                      placeholder="How did today go?"
                      oninput="updateField('notes', this.value)"
                      style="resize:vertical">${log.notes}</textarea>
          </div>
 
        </div>
      </div>
    </div>
  `;
}
 
// ── HELPERS ──
 
function renderMoodButtons(currentMood) {
  return ["😴 tired", "😐 okay", "🙂 good", "💪 great", "🔥 on fire"].map(m => {
    const active = currentMood === m;
    const style  = active
      ? "background:var(--accent);color:#0f0f0f;border:none;cursor:pointer;"
      : "background:#222;color:var(--muted);border:1px solid #333;cursor:pointer;";
    return `<button onclick="setMood('${m}')" class="px-3 py-1 rounded-full text-sm transition" style="${style}">${m}</button>`;
  }).join("");
}
 
function renderWorkoutRows(workouts) {
  if (!workouts.length) {
    return `<li class="py-4 text-sm text-center" style="color:var(--muted)">No workouts logged yet today.</li>`;
  }
  return workouts.map(w => `
    <li class="py-3 flex justify-between items-center" id="workout-${w.id}">
      <div>
        <p class="font-medium">${w.type}</p>
        <p class="text-sm" style="color:var(--muted)">
          ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}${w.notes ? ` · ${w.notes}` : ""}
        </p>
      </div>
      <button onclick="removeWorkout('${w.id}')"
              style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem">✕</button>
    </li>
  `).join("");
}
 
function renderActivityList(log, allLogs) {
  const today = new Date().toISOString().split("T")[0];
  const rows  = [];
 
  // Today's workouts first
  log.workouts.forEach(w => {
    rows.push(`
      <li class="py-4 flex justify-between items-center">
        <div>
          <p class="font-medium">${w.type}</p>
          <p class="text-sm" style="color:var(--muted)">Today</p>
        </div>
        <span style="background:#1e2a0e;color:var(--accent);" class="text-sm px-3 py-1 rounded-full">
          ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}
        </span>
      </li>
    `);
  });
 
  // Past days
  Object.entries(allLogs)
    .filter(([d]) => d !== today)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 4)
    .forEach(([date, l]) => {
      l.workouts.forEach(w => {
        rows.push(`
          <li class="py-4 flex justify-between items-center">
            <div>
              <p class="font-medium">${w.type}</p>
              <p class="text-sm" style="color:var(--muted)">${date}</p>
            </div>
            <span style="background:#1a2035;color:#60a5fa;" class="text-sm px-3 py-1 rounded-full">
              ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}
            </span>
          </li>
        `);
      });
    });
 
  return rows.length
    ? rows.slice(0, 5).join("")
    : `<li class="py-4 text-sm text-center" style="color:var(--muted)">No activity logged yet. Hit + to get started.</li>`;
}
 
function countWorkoutsThisWeek(allLogs) {
  const now   = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay()); // Sunday
  start.setHours(0, 0, 0, 0);
 
  return Object.entries(allLogs)
    .filter(([date]) => new Date(date) >= start)
    .reduce((sum, [, l]) => sum + l.workouts.length, 0);
}
 
// ── MODAL OPEN/CLOSE ──
// Exposed to window so the + card onclick works
window.openTrackerModal = () => {
  document.getElementById("trackerModal")?.classList.remove("hidden");
};
 
window.closeTrackerModal = () => {
  document.getElementById("trackerModal")?.classList.add("hidden");
  refreshStats(); // update stat cards when modal closes
};
 
// Close on backdrop click
document.addEventListener("click", e => {
  const modal = document.getElementById("trackerModal");
  if (modal && e.target === modal) {
    window.closeTrackerModal();
  }
});
 
// ── REFRESH STAT CARDS after modal closes ──
function refreshStats() {
  const name = localStorage.getItem("name");
  if (!name) return;
  const { db: dbModule } = import("../db.js").catch(() => {});
}
 
// Re-export renderMoodButtons and renderWorkoutRows so tracker.js can use them
export { renderMoodButtons, renderWorkoutRows };
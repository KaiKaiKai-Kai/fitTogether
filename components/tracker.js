import { db } from "../db.js";
 
export function tracker(username) {
  const log      = db.getLog(username);
  const allLogs  = db.getAllLogs(username);
  const dates    = Object.keys(allLogs).sort().reverse();
  const today    = new Date().toISOString().split("T")[0];
 
  const workoutRows = log.workouts.length
    ? log.workouts.map(w => `
        <li class="py-3 flex justify-between items-center">
          <div>
            <p class="font-medium">${w.type}</p>
            <p class="text-sm" style="color:var(--muted)">
              ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}
              ${w.notes ? ` · ${w.notes}` : ""}
            </p>
          </div>
          <button onclick="removeWorkout('${w.id}')"
                  style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem"
                  title="Remove">✕</button>
        </li>
      `).join("")
    : `<li class="py-4 text-sm text-center" style="color:var(--muted)">No workouts logged yet today.</li>`;
 
  const moodOptions = ["😴 tired", "😐 okay", "🙂 good", "💪 great", "🔥 on fire"].map(m => {
    const active = log.mood === m;
    const style  = active
      ? "background:var(--accent);color:#0f0f0f;border:none;cursor:pointer;"
      : "background:#222;color:var(--muted);border:1px solid #333;cursor:pointer;";
    return `<button onclick="setMood('${m}')"
            class="px-3 py-1 rounded-full text-sm transition"
            style="${style}">${m}</button>`;
  }).join("");
 
  const historyRows = dates.filter(d => d !== today).slice(0, 5).map(date => {
    const l = allLogs[date];
    return `
      <li class="py-3 flex justify-between items-center">
        <div>
          <p class="font-medium">${date}</p>
          <p class="text-sm" style="color:var(--muted)">
            ${l.workouts.length} workout${l.workouts.length !== 1 ? "s" : ""}
            · ${l.steps.toLocaleString()} steps
            · ${l.calories} kcal
          </p>
        </div>
        <span style="color:var(--accent)" class="text-lg">${l.mood?.split(" ")[0] || "—"}</span>
      </li>
    `;
  }).join("") || `<li class="py-4 text-sm text-center" style="color:var(--muted)">No previous logs yet.</li>`;
 
  return `
    <div class="max-w-4xl mx-auto px-4 py-10 fade-up">
 
      <!-- Header -->
      <div class="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 class="bebas text-4xl" style="color:var(--accent)">Today's Log</h2>
          <p style="color:var(--muted)" class="text-sm">${today}</p>
        </div>
        <div class="flex gap-2">
          <button onclick="exportData()" class="btn-ghost px-4 py-2 rounded-lg text-sm">
            ⬇ Export JSON
          </button>
          <label class="btn-ghost px-4 py-2 rounded-lg text-sm cursor-pointer">
            ⬆ Import JSON
            <input type="file" accept=".json" onchange="importData(event)" style="display:none">
          </label>
        </div>
      </div>
 
      <!-- Stats row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
 
        <!-- Steps -->
        <div class="dark-card p-5">
          <p class="text-sm mb-2" style="color:var(--muted)">Steps</p>
          <div class="flex items-center gap-2">
            <input id="field-steps" type="number" min="0"
                   class="fit-input" style="font-size:1.5rem;font-family:'Bebas Neue',sans-serif;"
                   value="${log.steps}"
                   onchange="updateField('steps', this.value)" />
          </div>
        </div>
 
        <!-- Calories -->
        <div class="dark-card p-5">
          <p class="text-sm mb-2" style="color:var(--muted)">Calories Burned</p>
          <input id="field-calories" type="number" min="0"
                 class="fit-input" style="font-size:1.5rem;font-family:'Bebas Neue',sans-serif;"
                 value="${log.calories}"
                 onchange="updateField('calories', this.value)" />
        </div>
 
        <!-- Water -->
        <div class="dark-card p-5">
          <p class="text-sm mb-2" style="color:var(--muted)">Water (glasses)</p>
          <div class="flex items-center gap-3">
            <button onclick="adjustWater(-1)"
                    style="background:#222;border:1px solid #333;color:var(--text);cursor:pointer;width:36px;height:36px;border-radius:8px;font-size:1.2rem">−</button>
            <span id="water-count" class="bebas text-3xl" style="color:var(--accent)">${log.water}</span>
            <button onclick="adjustWater(1)"
                    style="background:#222;border:1px solid #333;color:var(--text);cursor:pointer;width:36px;height:36px;border-radius:8px;font-size:1.2rem">+</button>
          </div>
        </div>
      </div>
 
      <!-- Mood -->
      <div class="dark-card p-5 mb-6">
        <p class="text-sm mb-3" style="color:var(--muted)">How are you feeling?</p>
        <div class="flex flex-wrap gap-2" id="mood-buttons">
          ${moodOptions}
        </div>
      </div>
 
      <!-- Log a workout -->
      <div class="dark-card p-6 mb-6">
        <h3 class="bebas text-2xl mb-4">Log a Workout</h3>
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
        <button onclick="addWorkout()" class="btn-accent px-6 py-2 rounded-lg">
          + Add Workout
        </button>
 
        <!-- Workout list -->
        <ul id="workout-list" class="divide-y divide-gray-800 mt-4">
          ${workoutRows}
        </ul>
      </div>
 
      <!-- Daily notes -->
      <div class="dark-card p-6 mb-6">
        <h3 class="bebas text-2xl mb-3">Notes</h3>
        <textarea id="field-notes" class="fit-input" rows="3"
                  placeholder="How did today go? Any wins or struggles?"
                  oninput="updateField('notes', this.value)"
                  style="resize:vertical">${log.notes}</textarea>
      </div>
 
      <!-- History -->
      <div class="dark-card p-6">
        <h3 class="bebas text-2xl mb-4">Recent History</h3>
        <ul id="history-list" class="divide-y divide-gray-800">
          ${historyRows}
        </ul>
      </div>
 
    </div>
  `;
}
 
// ── TRACKER ACTIONS (exposed to window by userDashboard) ──
export function mountTrackerActions(username) {
 
  // Update a stat card value in the dashboard
  function refreshStatCard(field, value) {
    const el = document.getElementById(`stat-${field}`);
    if (!el) return;
    if (field === "steps") el.textContent = value > 0 ? Number(value).toLocaleString() : "—";
    else                   el.textContent = value > 0 ? value : "—";
  }
 
  function refreshWorkoutCount() {
    const allLogs = db.getAllLogs(username);
    const now     = new Date();
    const start   = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    const count = Object.entries(allLogs)
      .filter(([date]) => new Date(date) >= start)
      .reduce((sum, [, l]) => sum + l.workouts.length, 0);
    const el = document.getElementById("stat-workouts");
    if (el) el.textContent = count;
  }
 
  function refreshActivityList() {
    const log     = db.getLog(username);
    const allLogs = db.getAllLogs(username);
    const today   = new Date().toISOString().split("T")[0];
    const list    = document.getElementById("activity-list");
    if (!list) return;
 
    const rows = [];
    log.workouts.forEach(w => {
      rows.push(`
        <li class="py-4 flex justify-between items-center">
          <div><p class="font-medium">${w.type}</p>
          <p class="text-sm" style="color:var(--muted)">Today</p></div>
          <span style="background:#1e2a0e;color:var(--accent);" class="text-sm px-3 py-1 rounded-full">
            ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}
          </span>
        </li>`);
    });
    Object.entries(allLogs)
      .filter(([d]) => d !== today)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 4)
      .forEach(([date, l]) => l.workouts.forEach(w => {
        rows.push(`
          <li class="py-4 flex justify-between items-center">
            <div><p class="font-medium">${w.type}</p>
            <p class="text-sm" style="color:var(--muted)">${date}</p></div>
            <span style="background:#1a2035;color:#60a5fa;" class="text-sm px-3 py-1 rounded-full">
              ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}
            </span>
          </li>`);
      }));
    list.innerHTML = rows.length
      ? rows.slice(0, 5).join("")
      : `<li class="py-4 text-sm text-center" style="color:var(--muted)">No activity logged yet. Hit + to get started.</li>`;
  }
 
  window.updateField = (field, value) => {
    db.updateLog(username, { [field]: field === "notes" ? value : Number(value) });
    if (field !== "notes") refreshStatCard(field, Number(value));
  };
 
  window.adjustWater = (delta) => {
    const log = db.getLog(username);
    const next = Math.max(0, log.water + delta);
    db.updateLog(username, { water: next });
    document.getElementById("water-count").textContent = next;
  };
 
  window.setMood = (mood) => {
    db.updateLog(username, { mood });
    const log = db.getLog(username);
    document.getElementById("mood-buttons").innerHTML =
      ["😴 tired", "😐 okay", "🙂 good", "💪 great", "🔥 on fire"].map(m => {
        const active = log.mood === m;
        const style  = active
          ? "background:var(--accent);color:#0f0f0f;border:none;cursor:pointer;"
          : "background:#222;color:var(--muted);border:1px solid #333;cursor:pointer;";
        return `<button onclick="setMood('${m}')" class="px-3 py-1 rounded-full text-sm transition" style="${style}">${m}</button>`;
      }).join("");
  };
 
  window.addWorkout = () => {
    const type     = document.getElementById("workout-type").value;
    const duration = Number(document.getElementById("workout-duration").value);
    const distance = Number(document.getElementById("workout-distance").value) || null;
    const notes    = document.getElementById("workout-notes").value.trim();
 
    if (!type)     { alert("Please select a workout type."); return; }
    if (!duration) { alert("Please enter a duration."); return; }
 
    const entry = db.addWorkout(username, { type, duration, distance, notes });
 
    // Append row to modal workout list
    const list  = document.getElementById("workout-list");
    const empty = list.querySelector("li");
    if (empty && !empty.querySelector("button")) list.innerHTML = "";
 
    list.insertAdjacentHTML("beforeend", `
      <li class="py-3 flex justify-between items-center" id="workout-${entry.id}">
        <div>
          <p class="font-medium">${entry.type}</p>
          <p class="text-sm" style="color:var(--muted)">
            ${entry.duration} min${entry.distance ? ` · ${entry.distance} km` : ""}
            ${entry.notes ? ` · ${entry.notes}` : ""}
          </p>
        </div>
        <button onclick="removeWorkout('${entry.id}')"
                style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem">✕</button>
      </li>
    `);
 
    // Clear inputs
    document.getElementById("workout-type").value     = "";
    document.getElementById("workout-duration").value = "";
    document.getElementById("workout-distance").value = "";
    document.getElementById("workout-notes").value    = "";
 
    // Refresh dashboard
    refreshWorkoutCount();
    refreshActivityList();
  };
 
  window.removeWorkout = (id) => {
    db.removeWorkout(username, id);
    document.getElementById(`workout-${id}`)?.remove();
    const list = document.getElementById("workout-list");
    if (!list.children.length) {
      list.innerHTML = `<li class="py-4 text-sm text-center" style="color:var(--muted)">No workouts logged yet today.</li>`;
    }
    refreshWorkoutCount();
    refreshActivityList();
  };
 
  window.exportData = () => db.export();
 
  window.importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await db.import(file);
      window.render();
    } catch {
      alert("Failed to import — make sure it's a valid FitTogether JSON file.");
    }
  };
}
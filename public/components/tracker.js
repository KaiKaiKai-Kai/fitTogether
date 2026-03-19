import { db } from "../db.js";

export function mountTrackerActions(uid) {

  function refreshStatCard(field, value) {
    const el = document.getElementById(`stat-${field}`);
    if (!el) return;
    if (field === "steps") el.textContent = value > 0 ? Number(value).toLocaleString() : "—";
    else                   el.textContent = value > 0 ? value : "—";
  }

  async function refreshWorkoutCount() {
    const allLogs  = await db.getAllLogs(uid);
    const now      = new Date();
    const start    = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    const count = Object.entries(allLogs)
      .filter(([date]) => new Date(date) >= start)
      .reduce((sum, [, l]) => sum + l.workouts.length, 0);
    const el = document.getElementById("stat-workouts");
    if (el) el.textContent = count;
  }

  async function refreshActivityList() {
    const log     = await db.getLog(uid);
    const allLogs = await db.getAllLogs(uid);
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
            ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}${w.heartRate ? ` · ❤️ ${w.heartRate} bpm` : ""}
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
              ${w.duration} min${w.distance ? ` · ${w.distance} km` : ""}${w.heartRate ? ` · ❤️ ${w.heartRate} bpm` : ""}
            </span>
          </li>`);
      }));

    list.innerHTML = rows.length
      ? rows.slice(0, 5).join("")
      : `<li class="py-4 text-sm text-center" style="color:var(--muted)">No activity logged yet. Hit + to get started.</li>`;
  }

  window.updateField = async (field, value) => {
    await db.updateLog(uid, { [field]: field === "notes" ? value : Number(value) });
    if (field !== "notes") refreshStatCard(field, Number(value));
  };

  window.setMood = async (mood) => {
    await db.updateLog(uid, { mood });
    const log = await db.getLog(uid);
    document.getElementById("mood-buttons").innerHTML =
      ["😴 tired", "😐 okay", "🙂 good", "💪 great", "🔥 on fire"].map(m => {
        const active = log.mood === m;
        const style  = active
          ? "background:var(--accent);color:#0f0f0f;border:none;cursor:pointer;"
          : "background:#222;color:var(--muted);border:1px solid #333;cursor:pointer;";
        return `<button onclick="setMood('${m}')" class="px-3 py-1 rounded-full text-sm transition" style="${style}">${m}</button>`;
      }).join("");
  };

  window.addWorkout = async () => {
    const type      = document.getElementById("workout-type").value;
    const duration  = Number(document.getElementById("workout-duration").value);
    const distance  = Number(document.getElementById("workout-distance").value) || null;
    const heartRate = Number(document.getElementById("workout-heartRate").value) || null;
    const notes     = document.getElementById("workout-notes").value.trim();

    if (!type)     { alert("Please select a workout type."); return; }
    if (!duration) { alert("Please enter a duration."); return; }

    const entry = await db.addWorkout(uid, { type, duration, distance, heartRate, notes });

    const list  = document.getElementById("workout-list");
    const empty = list.querySelector("li");
    if (empty && !empty.querySelector("button")) list.innerHTML = "";

    list.insertAdjacentHTML("beforeend", `
      <li class="py-3 flex justify-between items-center" id="workout-${entry.id}">
        <div>
          <p class="font-medium">${entry.type}</p>
          <p class="text-sm" style="color:var(--muted)">
            ${entry.duration} min${entry.distance ? ` · ${entry.distance} km` : ""}${entry.heartRate ? ` · ❤️ ${entry.heartRate} bpm` : ""}${entry.notes ? ` · ${entry.notes}` : ""}
          </p>
        </div>
        <button onclick="removeWorkout('${entry.id}')"
                style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem">✕</button>
      </li>
    `);

    document.getElementById("workout-type").value      = "";
    document.getElementById("workout-duration").value  = "";
    document.getElementById("workout-distance").value  = "";
    document.getElementById("workout-heartRate").value = "";
    document.getElementById("workout-notes").value     = "";

    refreshWorkoutCount();
    refreshActivityList();
  };

  window.removeWorkout = async (id) => {
    await db.removeWorkout(uid, id);
    document.getElementById(`workout-${id}`)?.remove();
    const list = document.getElementById("workout-list");
    if (!list.children.length) {
      list.innerHTML = `<li class="py-4 text-sm text-center" style="color:var(--muted)">No workouts logged yet today.</li>`;
    }
    refreshWorkoutCount();
    refreshActivityList();
  };

  window.exportData = async () => {
    const allLogs = await db.getAllLogs(uid);
    const blob = new Blob([JSON.stringify({ logs: allLogs }, null, 2)], { type: "application/json" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `fittogether_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  window.importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text   = await file.text();
      const parsed = JSON.parse(text);
      const logs   = parsed.logs || parsed.users?.[uid]?.logs || {};
      // Write each day's log into Firestore
      for (const [date, log] of Object.entries(logs)) {
        await db.updateLog(uid, log, date);
      }
      window.render();
    } catch {
      alert("Failed to import — make sure it's a valid FitTogether JSON file.");
    }
  };
}
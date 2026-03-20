import { db } from "../db.js";

// ── WORKOUT TYPES ──
const WORKOUT_TYPES = [
  "Run", "Walk", "Cycling", "Strength Training",
  "HIIT", "Yoga", "Swimming", "Stair Master",
  "Elliptical", "Indoor Rower", "Other"
];

// ── HELPERS ──
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ── MAIN COMPONENT ──
export async function calendar(uid) {
  const planned = await db.getPlannedWorkouts(uid);
  const today   = new Date().toISOString().split("T")[0];

  const now    = new Date();
  const year   = now.getFullYear();
  const month  = now.getMonth();

  return `
    <div class="max-w-4xl mx-auto px-4 py-10 fade-up">

      <!-- Header -->
      <div class="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 class="bebas text-4xl" style="color:var(--accent)">Workout Planner</h2>
          <p class="text-sm" style="color:var(--muted)">Plan ahead. Stay consistent.</p>
        </div>
        <div class="flex gap-2">
          <button id="notify-btn" onclick="requestNotifications()"
                  class="btn-ghost px-4 py-2 rounded-lg text-sm">
            🔔 Enable Reminders
          </button>
          <button onclick="navigateTo('dashboard')"
                  class="btn-ghost px-4 py-2 rounded-lg text-sm">← Back</button>
        </div>
      </div>

      <!-- Notification status -->
      <div id="notify-status" class="hidden dark-card p-4 mb-6 text-sm" style="border-color:#333"></div>

      <!-- Calendar -->
      <div class="dark-card p-6 mb-6">
        <div id="calendar-container">
          ${renderCalendarHTML(year, month, planned, today)}
        </div>
      </div>

      <!-- Upcoming planned workouts -->
      <div class="dark-card p-6">
        <h3 class="bebas text-2xl mb-4">Upcoming Workouts</h3>
        <ul class="divide-y divide-gray-800" id="upcoming-list">
          ${renderUpcomingHTML(planned, today)}
        </ul>
      </div>

    </div>

    <!-- ── PLAN WORKOUT MODAL ── -->
    <div id="planModal" class="modal-backdrop hidden">
      <div class="dark-card p-8 w-full max-w-md fade-up">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="bebas text-3xl" style="color:var(--accent)">Plan Workout</h2>
            <p id="plan-date-label" class="text-sm" style="color:var(--muted)"></p>
          </div>
          <button onclick="closePlanModal()"
                  style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.2rem">✕</button>
        </div>

        <div class="flex flex-col gap-4">
          <select id="plan-type" class="fit-input">
            <option value="">Select workout type</option>
            ${WORKOUT_TYPES.map(t => `<option>${t}</option>`).join("")}
          </select>

          <input id="plan-time" type="time" class="fit-input"
                 placeholder="Time (optional)" />

          <input id="plan-duration" type="number" min="1" class="fit-input"
                 placeholder="Duration in minutes (optional)" />

          <input id="plan-notes" type="text" class="fit-input"
                 placeholder="Notes (optional)" />

          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" id="plan-remind" checked
                   style="width:18px;height:18px;accent-color:var(--accent)" />
            <span class="text-sm" style="color:var(--muted)">
              Remind me 1 hour before
            </span>
          </label>

          <p id="plan-error" class="text-sm hidden" style="color:#f87171"></p>

          <button onclick="savePlannedWorkout()"
                  class="btn-accent px-6 py-3 rounded-lg w-full">
            Save Plan
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── CALENDAR HTML RENDERER ──
export function renderCalendarHTML(year, month, planned, today) {
  const monthName  = new Date(year, month).toLocaleString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);
  const dayNames    = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let cells = "";

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells += `<div></div>`;
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr   = toDateStr(year, month, d);
    const isToday   = dateStr === today;
    const isPast    = dateStr < today;
    const dayPlans  = planned[dateStr] || [];
    const hasPlan   = dayPlans.length > 0;

    const dotHTML = hasPlan
      ? `<div class="flex gap-0.5 justify-center mt-1 flex-wrap">
          ${dayPlans.slice(0, 3).map(() =>
            `<div style="width:5px;height:5px;border-radius:50%;background:var(--accent)"></div>`
          ).join("")}
         </div>`
      : "";

    cells += `
      <div onclick="${isPast ? "" : `openPlanModal('${dateStr}')`}"
           class="rounded-lg p-2 text-center transition"
           style="
             min-height:56px;
             cursor:${isPast ? "default" : "pointer"};
             background:${isToday ? "var(--accent)" : hasPlan ? "#1e2a0e" : "#1a1a1a"};
             color:${isToday ? "#0f0f0f" : isPast ? "var(--muted)" : "var(--text)"};
             border:1px solid ${isToday ? "var(--accent)" : hasPlan ? "#2d4a1e" : "#2a2a2a"};
             opacity:${isPast ? "0.5" : "1"};
           ">
        <p class="bebas text-lg" style="line-height:1">${d}</p>
        ${dotHTML}
      </div>
    `;
  }

  return `
    <!-- Nav -->
    <div class="flex justify-between items-center mb-4">
      <button onclick="changeMonth(-1)"
              class="btn-ghost px-3 py-1 rounded-lg text-sm">← Prev</button>
      <h3 class="bebas text-2xl" style="color:var(--accent)">${monthName}</h3>
      <button onclick="changeMonth(1)"
              class="btn-ghost px-3 py-1 rounded-lg text-sm">Next →</button>
    </div>

    <!-- Day headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      ${dayNames.map(d => `
        <div class="text-center text-xs font-medium py-1" style="color:var(--muted)">${d}</div>
      `).join("")}
    </div>

    <!-- Day grid -->
    <div class="grid grid-cols-7 gap-1" id="calendar-grid"
         data-year="${year}" data-month="${month}">
      ${cells}
    </div>

    <div class="flex gap-4 mt-4 text-xs" style="color:var(--muted)">
      <div class="flex items-center gap-1">
        <div style="width:10px;height:10px;border-radius:2px;background:var(--accent)"></div> Today
      </div>
      <div class="flex items-center gap-1">
        <div style="width:10px;height:10px;border-radius:2px;background:#1e2a0e;border:1px solid #2d4a1e"></div> Planned
      </div>
    </div>
  `;
}

// ── UPCOMING LIST RENDERER ──
export function renderUpcomingHTML(planned, today) {
  const upcoming = Object.entries(planned)
    .filter(([date]) => date >= today)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 10);

  if (!upcoming.length) {
    return `<li class="py-4 text-sm text-center" style="color:var(--muted)">
      No workouts planned yet. Click a day on the calendar to add one.
    </li>`;
  }

  return upcoming.flatMap(([date, plans]) =>
    plans.map((p, i) => `
      <li class="py-4 flex justify-between items-center">
        <div>
          <p class="font-medium">${p.type}</p>
          <p class="text-sm" style="color:var(--muted)">
            ${formatDate(date)}${p.time ? ` at ${p.time}` : ""}
            ${p.duration ? ` · ${p.duration} min` : ""}
            ${p.notes ? ` · ${p.notes}` : ""}
          </p>
        </div>
        <div class="flex items-center gap-2">
          ${p.remind ? `<span style="color:var(--accent)" title="Reminder set">🔔</span>` : ""}
          <button onclick="deletePlannedWorkout('${date}', ${i})"
                  style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem"
                  title="Remove">✕</button>
        </div>
      </li>
    `)
  ).join("");
}

// ── MOUNT CALENDAR ACTIONS ──
export function mountCalendarActions(uid) {
  let currentYear  = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let selectedDate = null;

  // ── Month navigation ──
  window.changeMonth = async (delta) => {
    currentMonth += delta;
    if (currentMonth > 11) { currentMonth = 0;  currentYear++; }
    if (currentMonth < 0)  { currentMonth = 11; currentYear--; }

    const planned = await db.getPlannedWorkouts(uid);
    const today   = new Date().toISOString().split("T")[0];
    document.getElementById("calendar-container").innerHTML =
      renderCalendarHTML(currentYear, currentMonth, planned, today);
  };

  // ── Open plan modal ──
  window.openPlanModal = (dateStr) => {
    selectedDate = dateStr;
    document.getElementById("plan-date-label").textContent = formatDate(dateStr);
    document.getElementById("plan-type").value    = "";
    document.getElementById("plan-time").value    = "";
    document.getElementById("plan-duration").value = "";
    document.getElementById("plan-notes").value   = "";
    document.getElementById("plan-remind").checked = true;
    document.getElementById("plan-error").classList.add("hidden");
    document.getElementById("planModal").classList.remove("hidden");
  };

  window.closePlanModal = () => {
    document.getElementById("planModal").classList.add("hidden");
  };

  // Close on backdrop click
  document.getElementById("planModal").addEventListener("click", e => {
    if (e.target === document.getElementById("planModal")) window.closePlanModal();
  });

  // ── Save planned workout ──
  window.savePlannedWorkout = async () => {
    const type     = document.getElementById("plan-type").value;
    const time     = document.getElementById("plan-time").value;
    const duration = document.getElementById("plan-duration").value;
    const notes    = document.getElementById("plan-notes").value.trim();
    const remind   = document.getElementById("plan-remind").checked;
    const errEl    = document.getElementById("plan-error");

    if (!type) {
      errEl.textContent = "Please select a workout type.";
      errEl.classList.remove("hidden");
      return;
    }

    errEl.classList.add("hidden");

    const plan = {
      type,
      time:     time || null,
      duration: duration ? Number(duration) : null,
      notes:    notes || null,
      remind
    };

    await db.addPlannedWorkout(uid, selectedDate, plan);

    // Schedule notification if time is set and reminders enabled
    if (remind && time) {
      scheduleNotification(selectedDate, time, type);
    }

    window.closePlanModal();

    // Refresh both calendar and upcoming list
    const planned = await db.getPlannedWorkouts(uid);
    const today   = new Date().toISOString().split("T")[0];
    document.getElementById("calendar-container").innerHTML =
      renderCalendarHTML(currentYear, currentMonth, planned, today);
    document.getElementById("upcoming-list").innerHTML =
      renderUpcomingHTML(planned, today);
  };

  // ── Delete planned workout ──
  window.deletePlannedWorkout = async (dateStr, index) => {
    await db.removePlannedWorkout(uid, dateStr, index);
    const planned = await db.getPlannedWorkouts(uid);
    const today   = new Date().toISOString().split("T")[0];
    document.getElementById("upcoming-list").innerHTML =
      renderUpcomingHTML(planned, today);
    document.getElementById("calendar-container").innerHTML =
      renderCalendarHTML(currentYear, currentMonth, planned, today);
  };

  // ── Notifications ──
  window.requestNotifications = async () => {
    const statusEl = document.getElementById("notify-status");
    statusEl.classList.remove("hidden");

    if (!("Notification" in window)) {
      statusEl.textContent  = "⚠️ Your browser doesn't support notifications.";
      statusEl.style.color  = "#f87171";
      return;
    }

    if (Notification.permission === "granted") {
      statusEl.textContent = "✅ Reminders are already enabled.";
      statusEl.style.color = "var(--accent)";
      updateNotifyButton(true);
      // Schedule any existing reminders
      const planned = await db.getPlannedWorkouts(uid);
      scheduleAllNotifications(planned);
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      statusEl.textContent = "✅ Reminders enabled! You'll get notified 1 hour before each planned workout.";
      statusEl.style.color = "var(--accent)";
      updateNotifyButton(true);
      const planned = await db.getPlannedWorkouts(uid);
      scheduleAllNotifications(planned);
    } else {
      statusEl.textContent = "❌ Permission denied. Enable notifications in your browser settings.";
      statusEl.style.color = "#f87171";
    }
  };

  // Check current permission on load and update button
  if (Notification.permission === "granted") {
    updateNotifyButton(true);
    db.getPlannedWorkouts(uid).then(scheduleAllNotifications);
  }
}

// ── NOTIFICATION HELPERS ──
function updateNotifyButton(enabled) {
  const btn = document.getElementById("notify-btn");
  if (!btn) return;
  btn.textContent = enabled ? "🔔 Reminders On" : "🔔 Enable Reminders";
  btn.style.color = enabled ? "var(--accent)" : "";
}

function scheduleAllNotifications(planned) {
  Object.entries(planned).forEach(([date, plans]) => {
    plans.forEach(p => {
      if (p.remind && p.time) {
        scheduleNotification(date, p.time, p.type);
      }
    });
  });
}

function scheduleNotification(dateStr, time, workoutType) {
  if (Notification.permission !== "granted") return;

  const [hours, minutes] = time.split(":").map(Number);
  const workoutTime      = new Date(dateStr + "T00:00:00");
  workoutTime.setHours(hours, minutes, 0, 0);

  // Notify 1 hour before
  const notifyTime = new Date(workoutTime.getTime() - 60 * 60 * 1000);
  const now        = Date.now();
  const delay      = notifyTime.getTime() - now;

  if (delay <= 0) return; // already past

  setTimeout(() => {
    new Notification("FitTogether — Workout Reminder 💪", {
      body: `Your ${workoutType} is in 1 hour at ${time}. Get ready!`,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag:  `workout-${dateStr}-${time}` // prevents duplicate notifications
    });
  }, delay);
}
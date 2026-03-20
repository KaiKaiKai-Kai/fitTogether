import { db } from "../db.js";

// ── HELPERS — work on pre-fetched profile data ──

function getTotalWorkouts(logs) {
  return Object.values(logs || {})
    .reduce((sum, l) => sum + (l.workouts?.length || 0), 0);
}

function getTotalSteps(logs) {
  return Object.values(logs || {})
    .reduce((sum, l) => sum + (l.steps || 0), 0);
}

function getActiveDays(logs) {
  return Object.keys(logs || {}).filter(d =>
    logs[d].workouts?.length > 0 || logs[d].steps > 0
  ).length;
}

function getTodayWorkouts(logs) {
  const today = new Date().toISOString().split("T")[0];
  return logs?.[today]?.workouts?.length || 0;
}

function buildEntry(uid, username, logs, rank, isYou) {
  const workouts   = getTotalWorkouts(logs);
  const steps      = getTotalSteps(logs);
  const activeDays = getActiveDays(logs);
  const todayW     = getTodayWorkouts(logs);
  const displayName = username || uid.slice(0, 8);

  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  const highlight = isYou ? "border:1px solid var(--accent);" : "border:1px solid #2a2a2a;";
  const youBadge  = isYou
    ? `<span style="background:var(--accent);color:#0f0f0f;font-size:0.65rem;"
             class="px-2 py-0.5 rounded uppercase tracking-widest font-bold ml-2">You</span>`
    : "";

  return `
    <li class="dark-card p-4 flex items-center gap-4 fade-up" style="${highlight}">
      <div class="bebas text-2xl w-10 text-center flex-shrink-0"
           style="color:${rank <= 3 ? "var(--accent)" : "var(--muted)"}">
        ${medal}
      </div>
      <div class="bebas text-xl flex items-center justify-center rounded-full flex-shrink-0"
           style="width:42px;height:42px;background:${isYou ? "var(--accent)" : "#2a2a2a"};color:${isYou ? "#0f0f0f" : "var(--text)"}">
        ${displayName.charAt(0).toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1">
          <p class="font-semibold truncate">${displayName}</p>
          ${youBadge}
        </div>
        <p class="text-xs" style="color:var(--muted)">
          ${activeDays} active day${activeDays !== 1 ? "s" : ""}
          · ${todayW > 0 ? `${todayW} today` : "no workouts today"}
        </p>
      </div>
      <div class="flex gap-4 text-center flex-shrink-0">
        <div>
          <p class="bebas text-xl" style="color:var(--accent)">${workouts}</p>
          <p class="text-xs" style="color:var(--muted)">Workouts</p>
        </div>
        <div class="hidden sm:block">
          <p class="bebas text-xl" style="color:var(--accent)">
            ${steps > 0 ? (steps / 1000).toFixed(1) + "k" : "—"}
          </p>
          <p class="text-xs" style="color:var(--muted)">Steps</p>
        </div>
      </div>
    </li>
  `;
}

function rankBanner(rank, total) {
  if (!rank) return "";
  return `
    <div style="background:linear-gradient(135deg,#1e2a0e,#141414);border:1px solid var(--accent);"
         class="rounded-xl p-4 mb-5 flex items-center justify-between">
      <div>
        <p class="text-sm" style="color:var(--muted)">Your Rank</p>
        <p class="bebas text-3xl" style="color:var(--accent)">#${rank} of ${total}</p>
      </div>
      <div class="bebas text-5xl">${rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "💪"}</div>
    </div>
  `;
}

// ── MAIN COMPONENT ──
export async function leaderboard(uid) {
  const activeTab = localStorage.getItem("leaderboardTab") || "friends";

  // Fetch all data in parallel
  const [allProfiles, friendIds] = await Promise.all([
    db.getAllProfiles(),
    db.getFriends(uid)
  ]);

  // ── FRIENDS BOARD ──
  const friendUids     = [...new Set([uid, ...friendIds])];
  const friendsRanked  = friendUids
    .filter(id => allProfiles[id]) // only include users with profiles
    .map(id => ({
      id,
      username: allProfiles[id].username,
      logs:     allProfiles[id].logs || {},
      total:    getTotalWorkouts(allProfiles[id].logs || {})
    }))
    .sort((a, b) => b.total - a.total);

  const yourFriendsRank = friendsRanked.findIndex(e => e.id === uid) + 1;

  const friendsBoardHTML = friendsRanked.length > 1
    ? `<ul class="flex flex-col gap-3">
        ${friendsRanked.map((e, i) => buildEntry(e.id, e.username, e.logs, i + 1, e.id === uid)).join("")}
       </ul>`
    : `<div class="dark-card p-10 text-center">
        <p class="text-4xl mb-3">👥</p>
        <p class="bebas text-2xl mb-2" style="color:var(--accent)">No Friends Yet</p>
        <p style="color:var(--muted)" class="text-sm mb-4">Add friends to compete on the leaderboard.</p>
        <button onclick="navigateTo('friends')" class="btn-accent px-6 py-2 rounded-lg text-sm">
          Find Friends
        </button>
       </div>`;

  // ── GLOBAL BOARD ──
  const globalRanked = Object.entries(allProfiles)
    .map(([id, profile]) => ({
      id,
      username: profile.username,
      logs:     profile.logs || {},
      total:    getTotalWorkouts(profile.logs || {})
    }))
    .sort((a, b) => b.total - a.total);

  const yourGlobalRank = globalRanked.findIndex(e => e.id === uid) + 1;

  const globalBoardHTML = globalRanked.length
    ? `<ul class="flex flex-col gap-3">
        ${globalRanked.map((e, i) => buildEntry(e.id, e.username, e.logs, i + 1, e.id === uid)).join("")}
       </ul>`
    : `<div class="dark-card p-10 text-center">
        <p class="text-4xl mb-3">🌍</p>
        <p class="bebas text-2xl mb-2" style="color:var(--accent)">No Users Yet</p>
        <p style="color:var(--muted)" class="text-sm">Be the first to log a workout!</p>
       </div>`;

  return `
    <div class="max-w-2xl mx-auto px-4 py-10 fade-up">

      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="bebas text-4xl" style="color:var(--accent)">Leaderboard</h2>
          <p class="text-sm" style="color:var(--muted)">Ranked by total workouts</p>
        </div>
        <button onclick="navigateTo('dashboard')" class="btn-ghost px-4 py-2 rounded-lg text-sm">
          ← Back
        </button>
      </div>

      <!-- Tab switcher -->
      <div class="flex gap-2 mb-6 p-1 rounded-xl" style="background:#1a1a1a;border:1px solid #2a2a2a;">
        <button id="tab-friends" onclick="switchLeaderboardTab('friends')"
                class="flex-1 py-2 rounded-lg text-sm font-medium transition"
                style="${activeTab === "friends"
                  ? "background:var(--accent);color:#0f0f0f;border:none;cursor:pointer;"
                  : "background:transparent;color:var(--muted);border:none;cursor:pointer;"}">
          👥 Friends
        </button>
        <button id="tab-global" onclick="switchLeaderboardTab('global')"
                class="flex-1 py-2 rounded-lg text-sm font-medium transition"
                style="${activeTab === "global"
                  ? "background:var(--accent);color:#0f0f0f;border:none;cursor:pointer;"
                  : "background:transparent;color:var(--muted);border:none;cursor:pointer;"}">
          🌍 Global
        </button>
      </div>

      <!-- Friends board -->
      <div id="board-friends" ${activeTab !== "friends" ? 'class="hidden"' : ""}>
        ${rankBanner(yourFriendsRank, friendsRanked.length)}
        ${friendsBoardHTML}
      </div>

      <!-- Global board -->
      <div id="board-global" ${activeTab !== "global" ? 'class="hidden"' : ""}>
        ${rankBanner(yourGlobalRank, globalRanked.length)}
        ${globalBoardHTML}
      </div>

    </div>
  `;
}

// ── TAB SWITCHER ──
export function mountLeaderboardActions() {
  window.switchLeaderboardTab = (tab) => {
    localStorage.setItem("leaderboardTab", tab);
    document.getElementById("board-friends").classList.toggle("hidden", tab !== "friends");
    document.getElementById("board-global").classList.toggle("hidden",  tab !== "global");
    const accent = "background:var(--accent);color:#0f0f0f;border:none;cursor:pointer;";
    const ghost  = "background:transparent;color:var(--muted);border:none;cursor:pointer;";
    document.getElementById("tab-friends").style.cssText = tab === "friends" ? accent : ghost;
    document.getElementById("tab-global").style.cssText  = tab === "global"  ? accent : ghost;
  };
}
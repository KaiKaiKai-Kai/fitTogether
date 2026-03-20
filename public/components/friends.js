import { db } from "../db.js";

export async function friends(uid) {
  const [friendIds, allProfiles] = await Promise.all([
    db.getFriends(uid),
    db.getAllProfiles()
  ]);

  const today = new Date().toISOString().split("T")[0];

  function buildFriendCard(friendUid) {
    const profile  = allProfiles[friendUid];
    if (!profile) return ""; // user exists in auth but no profile yet
    const todayLog = profile.logs?.[today];
    const total    = Object.values(profile.logs || {})
      .reduce((sum, l) => sum + (l.workouts?.length || 0), 0);
    const mood     = todayLog?.mood || null;
    const name     = profile.username || friendUid;

    return `
      <div class="dark-card p-6 flex flex-col gap-4 fade-up">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div class="bebas text-2xl flex items-center justify-center rounded-full"
                 style="width:48px;height:48px;background:var(--accent);color:#0f0f0f">
              ${name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="font-semibold text-lg">${name}</p>
              <p class="text-sm" style="color:var(--muted)">
                ${mood ? `Feeling ${mood}` : "No update today"}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="viewFriendProfile('${friendUid}')"
                    class="btn-accent px-4 py-2 rounded-lg text-sm">
              View Profile
            </button>
            <button onclick="removeFriend('${friendUid}')"
                    class="btn-ghost px-3 py-2 rounded-lg text-sm"
                    style="border-color:#444;color:var(--muted)">
              Remove
            </button>
          </div>
        </div>

        <!-- Mini stats -->
        <div class="grid grid-cols-3 gap-3 pt-2" style="border-top:1px solid #2a2a2a">
          <div class="text-center">
            <p class="bebas text-2xl" style="color:var(--accent)">
              ${todayLog?.steps > 0 ? todayLog.steps.toLocaleString() : "—"}
            </p>
            <p class="text-xs" style="color:var(--muted)">Steps Today</p>
          </div>
          <div class="text-center">
            <p class="bebas text-2xl" style="color:var(--accent)">
              ${todayLog?.workouts?.length || 0}
            </p>
            <p class="text-xs" style="color:var(--muted)">Workouts Today</p>
          </div>
          <div class="text-center">
            <p class="bebas text-2xl" style="color:var(--accent)">${total}</p>
            <p class="text-xs" style="color:var(--muted)">All Time</p>
          </div>
        </div>
      </div>
    `;
  }

  const friendCardsHTML = friendIds.length
    ? friendIds.map(buildFriendCard).filter(Boolean).join("")
    : `<div class="dark-card p-10 text-center fade-up">
        <p class="text-4xl mb-4">👥</p>
        <p class="bebas text-2xl mb-2" style="color:var(--accent)">No Friends Yet</p>
        <p style="color:var(--muted)" class="text-sm">Search for a username above to add your first friend.</p>
       </div>`;

  return `
    <div class="max-w-3xl mx-auto px-4 py-10 fade-up">

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="bebas text-4xl" style="color:var(--accent)">Friends</h2>
          <p style="color:var(--muted)" class="text-sm">
            ${friendIds.length} friend${friendIds.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onclick="navigateTo('dashboard')" class="btn-ghost px-4 py-2 rounded-lg text-sm">
          ← Back
        </button>
      </div>

      <!-- Add friend -->
      <div class="dark-card p-5 mb-6">
        <p class="text-sm mb-3 font-medium">Add a Friend by Username</p>
        <div class="flex gap-3">
          <input id="friend-search" type="text" class="fit-input"
                 placeholder="Enter exact username..."
                 onkeydown="if(event.key==='Enter') addFriend()" />
          <button onclick="addFriend()" class="btn-accent px-5 py-2 rounded-lg text-sm whitespace-nowrap">
            Add Friend
          </button>
        </div>
        <p id="friend-msg" class="text-sm mt-2 hidden"></p>
      </div>

      <!-- Friend cards -->
      <div class="flex flex-col gap-4" id="friend-list">
        ${friendCardsHTML}
      </div>

    </div>
  `;
}

export function mountFriendActions(uid) {

  window.addFriend = async () => {
    const input = document.getElementById("friend-search");
    const msg   = document.getElementById("friend-msg");
    const query = input.value.trim().toLowerCase();

    msg.classList.remove("hidden");

    if (!query) { showMsg(msg, "Please enter a username.", "red"); return; }

    // Search all profiles for a matching username
    const allProfiles = await db.getAllProfiles();
    const match = Object.entries(allProfiles)
      .find(([id, p]) => p.username?.toLowerCase() === query);

    if (!match)           { showMsg(msg, `User "${query}" not found.`, "red");          return; }
    if (match[0] === uid) { showMsg(msg, "You can't add yourself.", "red");              return; }

    const currentFriends = await db.getFriends(uid);
    if (currentFriends.includes(match[0])) {
      showMsg(msg, `${query} is already your friend.`, "var(--muted)");
      return;
    }

    await db.addFriend(uid, match[0]);
    showMsg(msg, `${query} added!`, "var(--accent)");
    input.value = "";

    // Re-render friend list
    await refreshFriendList(uid);
  };

  window.removeFriend = async (friendUid) => {
    if (!confirm("Remove this friend?")) return;
    await db.removeFriend(uid, friendUid);
    await refreshFriendList(uid);
  };

  window.viewFriendProfile = (friendUid) => {
    localStorage.setItem("viewingFriend", friendUid);
    navigateTo("friendProfile");
  };
}

function showMsg(el, text, color) {
  el.textContent = text;
  el.style.color = color;
  el.classList.remove("hidden");
}

async function refreshFriendList(uid) {
  const [friendIds, allProfiles] = await Promise.all([
    db.getFriends(uid),
    db.getAllProfiles()
  ]);
  const today = new Date().toISOString().split("T")[0];
  const list  = document.getElementById("friend-list");
  if (!list) return;

  if (!friendIds.length) {
    list.innerHTML = `
      <div class="dark-card p-10 text-center fade-up">
        <p class="text-4xl mb-4">👥</p>
        <p class="bebas text-2xl mb-2" style="color:var(--accent)">No Friends Yet</p>
        <p style="color:var(--muted)" class="text-sm">Search for a username above to add your first friend.</p>
      </div>`;
    return;
  }

  list.innerHTML = friendIds.map(friendUid => {
    const profile  = allProfiles[friendUid];
    if (!profile) return "";
    const todayLog = profile.logs?.[today];
    const total    = Object.values(profile.logs || {})
      .reduce((sum, l) => sum + (l.workouts?.length || 0), 0);
    const mood     = todayLog?.mood || null;
    const name     = profile.username || friendUid;

    return `
      <div class="dark-card p-6 flex flex-col gap-4 fade-up">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div class="bebas text-2xl flex items-center justify-center rounded-full"
                 style="width:48px;height:48px;background:var(--accent);color:#0f0f0f">
              ${name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="font-semibold text-lg">${name}</p>
              <p class="text-sm" style="color:var(--muted)">${mood ? `Feeling ${mood}` : "No update today"}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="viewFriendProfile('${friendUid}')"
                    class="btn-accent px-4 py-2 rounded-lg text-sm">View Profile</button>
            <button onclick="removeFriend('${friendUid}')"
                    class="btn-ghost px-3 py-2 rounded-lg text-sm"
                    style="border-color:#444;color:var(--muted)">Remove</button>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 pt-2" style="border-top:1px solid #2a2a2a">
          <div class="text-center">
            <p class="bebas text-2xl" style="color:var(--accent)">
              ${todayLog?.steps > 0 ? todayLog.steps.toLocaleString() : "—"}
            </p>
            <p class="text-xs" style="color:var(--muted)">Steps Today</p>
          </div>
          <div class="text-center">
            <p class="bebas text-2xl" style="color:var(--accent)">${todayLog?.workouts?.length || 0}</p>
            <p class="text-xs" style="color:var(--muted)">Workouts Today</p>
          </div>
          <div class="text-center">
            <p class="bebas text-2xl" style="color:var(--accent)">${total}</p>
            <p class="text-xs" style="color:var(--muted)">All Time</p>
          </div>
        </div>
      </div>`;
  }).filter(Boolean).join("");
}
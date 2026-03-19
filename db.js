// ── DATABASE ──
// Reads/writes to localStorage structured as JSON.
// Call db.export() to download a real .json file at any time.

const DB_KEY = "fittogether_db";

function getDB() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || { users: {} };
  } catch {
    return { users: {} };
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db, null, 2));
}

function today() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export const db = {

  // Get today's log for a user, creating it if it doesn't exist
  getLog(username, date = today()) {
    const data = getDB();
    data.users[username] ??= { logs: {}, friends: [] };
    data.users[username].logs[date] ??= {
      steps: 0, calories: 0, heartRate: 0,
      workouts: [], mood: "", notes: ""
    };
    saveDB(data);
    return data.users[username].logs[date];
  },

  // Update today's log fields
  updateLog(username, fields, date = today()) {
    const data = getDB();
    data.users[username] ??= { logs: {}, friends: [] };
    data.users[username].logs[date] ??= {
      steps: 0, calories: 0, heartRate: 0,
      workouts: [], mood: "", notes: ""
    };
    Object.assign(data.users[username].logs[date], fields);
    saveDB(data);
  },

  // Add a workout entry to today's log
  addWorkout(username, workout, date = today()) {
    const data = getDB();
    data.users[username] ??= { logs: {}, friends: [] };
    data.users[username].logs[date] ??= {
      steps: 0, calories: 0, heartRate: 0,
      workouts: [], mood: "", notes: ""
    };
    const entry = {
      id: `w${Date.now()}`,
      ...workout,
      timestamp: new Date().toISOString()
    };
    data.users[username].logs[date].workouts.push(entry);
    saveDB(data);
    return entry;
  },

  // Remove a workout by id
  removeWorkout(username, workoutId, date = today()) {
    const data = getDB();
    const log = data.users[username]?.logs?.[date];
    if (!log) return;
    log.workouts = log.workouts.filter(w => w.id !== workoutId);
    saveDB(data);
  },

  // Get all logs for a user
  getAllLogs(username) {
    const data = getDB();
    return data.users[username]?.logs || {};
  },

  // ── FRIENDS ──

  getFriends(username) {
    const data = getDB();
    return data.users[username]?.friends || [];
  },

  addFriend(username, friendId) {
    const data = getDB();
    data.users[username] ??= { logs: {}, friends: [] };
    data.users[username].friends ??= [];
    if (!data.users[username].friends.includes(friendId)) {
      data.users[username].friends.push(friendId);
      saveDB(data);
      return true;
    }
    return false;
  },

  removeFriend(username, friendId) {
    const data = getDB();
    if (!data.users[username]?.friends) return;
    data.users[username].friends = data.users[username].friends.filter(f => f !== friendId);
    saveDB(data);
  },

  // Returns a FROZEN deep copy of a friend's public data — cannot write back
  getFriendProfile(friendId) {
    const data = getDB();
    const raw = data.users[friendId];
    if (!raw) return null;
    return Object.freeze(JSON.parse(JSON.stringify({
      logs: raw.logs || {}
    })));
  },

  // ── IMPORT / EXPORT ──

  export() {
    const data = getDB();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fittogether_${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target.result);
          saveDB(parsed);
          resolve(parsed);
        } catch {
          reject(new Error("Invalid JSON file"));
        }
      };
      reader.readAsText(file);
    });
  }
};
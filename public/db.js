import { firestore } from "./firebase.js";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function today() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function emptyLog() {
  return {
    steps: 0, calories: 0, heartRate: 0,
    workouts: [], mood: "", notes: ""
  };
}

export const db = {

  // ── LOGS ──

  async getLog(uid, date = today()) {
    const snap = await getDoc(doc(firestore, "users", uid));
    return snap.exists()
      ? (snap.data().logs?.[date] ?? emptyLog())
      : emptyLog();
  },

  async updateLog(uid, fields, date = today()) {
    // merge: true means we only update the fields provided, not wipe the whole doc
    await setDoc(
      doc(firestore, "users", uid),
      { logs: { [date]: fields } },
      { merge: true }
    );
  },

  async addWorkout(uid, workout, date = today()) {
    const snap     = await getDoc(doc(firestore, "users", uid));
    const existing = snap.data()?.logs?.[date]?.workouts || [];
    const entry    = {
      id: `w${Date.now()}`,
      ...workout,
      timestamp: new Date().toISOString()
    };
    await setDoc(
      doc(firestore, "users", uid),
      { logs: { [date]: { workouts: [...existing, entry] } } },
      { merge: true }
    );
    return entry;
  },

  async removeWorkout(uid, workoutId, date = today()) {
    const snap     = await getDoc(doc(firestore, "users", uid));
    const workouts = (snap.data()?.logs?.[date]?.workouts || [])
      .filter(w => w.id !== workoutId);
    await setDoc(
      doc(firestore, "users", uid),
      { logs: { [date]: { workouts } } },
      { merge: true }
    );
  },

  async getAllLogs(uid) {
    const snap = await getDoc(doc(firestore, "users", uid));
    return snap.exists() ? (snap.data().logs || {}) : {};
  },

  // ── FRIENDS ──

  async getFriends(uid) {
    const snap = await getDoc(doc(firestore, "users", uid));
    return snap.data()?.friends || [];
  },

  async addFriend(uid, friendId) {
    await setDoc(
      doc(firestore, "users", uid),
      { friends: arrayUnion(friendId) },
      { merge: true }
    );
  },

  async removeFriend(uid, friendId) {
    await updateDoc(
      doc(firestore, "users", uid),
      { friends: arrayRemove(friendId) }
    );
  },

  // Returns a frozen deep copy — cannot be used to write back
  async getFriendProfile(friendId) {
    const snap = await getDoc(doc(firestore, "users", friendId));
    if (!snap.exists()) return null;
    return Object.freeze(JSON.parse(JSON.stringify({
      logs: snap.data().logs || {}
    })));
  },

  // ── USER PROFILE ──

  // Save display name and role when a user registers
  async createProfile(uid, username, role = "user") {
    await setDoc(
      doc(firestore, "users", uid),
      { username, role, friends: [], logs: {} },
      { merge: true }
    );
  },

  // Get a user's profile (username, role)
  async getProfile(uid) {
    const snap = await getDoc(doc(firestore, "users", uid));
    return snap.exists() ? snap.data() : null;
  },

  // Get all user profiles for the leaderboard
  async getAllProfiles() {
    const { collection, getDocs } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );
    const snap = await getDocs(collection(firestore, "users"));
    const result = {};
    snap.forEach(d => { result[d.id] = d.data(); });
    return result;
  }
};
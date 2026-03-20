import { firestore } from "./firebase.js";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function today() {
  return new Date().toISOString().split("T")[0];
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

  // ── PLANNED WORKOUTS ──

  // Get all planned workouts — returns { "YYYY-MM-DD": [{ type, time, duration, notes, remind }] }
  async getPlannedWorkouts(uid) {
    const snap = await getDoc(doc(firestore, "users", uid));
    return snap.exists() ? (snap.data().planned || {}) : {};
  },

  // Add a planned workout to a specific date
  async addPlannedWorkout(uid, date, plan) {
    const snap     = await getDoc(doc(firestore, "users", uid));
    const existing = snap.data()?.planned?.[date] || [];
    await setDoc(
      doc(firestore, "users", uid),
      { planned: { [date]: [...existing, plan] } },
      { merge: true }
    );
  },

  // Remove a planned workout by index on a specific date
  async removePlannedWorkout(uid, date, index) {
    const snap  = await getDoc(doc(firestore, "users", uid));
    const plans = [...(snap.data()?.planned?.[date] || [])];
    plans.splice(index, 1);
    await setDoc(
      doc(firestore, "users", uid),
      { planned: { [date]: plans } },
      { merge: true }
    );
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

  async getFriendProfile(friendId) {
    const snap = await getDoc(doc(firestore, "users", friendId));
    if (!snap.exists()) return null;
    return Object.freeze(JSON.parse(JSON.stringify({
      logs: snap.data().logs || {}
    })));
  },

  // ── USER PROFILE ──

  async createProfile(uid, username, role = "user") {
    await setDoc(
      doc(firestore, "users", uid),
      { username, role, friends: [], logs: {}, planned: {} },
      { merge: true }
    );
  },

  async getProfile(uid) {
    const snap = await getDoc(doc(firestore, "users", uid));
    return snap.exists() ? snap.data() : null;
  },

  async getAllProfiles() {
    const { collection, getDocs } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );
    const snap   = await getDocs(collection(firestore, "users"));
    const result = {};
    snap.forEach(d => { result[d.id] = d.data(); });
    return result;
  }
};
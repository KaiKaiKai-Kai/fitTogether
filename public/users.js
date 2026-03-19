// ── USER STORE ──
// Add or remove users here as the project grows.
// Roles: "admin" | "user" | "basic"
const users = {
  "admin":  { password: "abc", role: "admin", name: "Admin"  },
  "john":   { password: "abc", role: "user",  name: "John" , friendHash: "" , dailySteps: "8240", dailyCalories: "430" , weeklyWorkouts: "3" ,  workoutTime: "0:10:08" , avgHeartRate: "110"},
  "strong": { password: "abc", role: "user",  name: "Strong" },
  "guest":  { password: "abc", role: "basic", name: "Guest"  }
};
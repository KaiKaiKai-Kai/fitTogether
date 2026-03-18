export const userDashboard = `
  <div class="min-h-screen bg-gray-100">
 
    <!-- Header -->
    <div class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">FitTogether</h1>
      <button onclick="logout()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
        Log Out
      </button>
    </div>
 
    <!-- Main Content -->
    <div class="max-w-4xl mx-auto mt-10 px-4">
 
      <!-- Welcome Banner -->
      <div class="bg-blue-500 text-white rounded-xl p-6 mb-6 shadow">
        <h2 class="text-2xl font-bold mb-1">Welcome back! 💪</h2>
        <p class="text-blue-100">Here's your fitness summary for today.</p>
      </div>
 
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
 
        <div class="bg-white rounded-xl p-5 shadow text-center">
          <p class="text-4xl font-bold text-blue-500">8,240</p>
          <p class="text-gray-500 mt-1">Steps Today</p>
        </div>
 
        <div class="bg-white rounded-xl p-5 shadow text-center">
          <p class="text-4xl font-bold text-green-500">430</p>
          <p class="text-gray-500 mt-1">Calories Burned</p>
        </div>
 
        <div class="bg-white rounded-xl p-5 shadow text-center">
          <p class="text-4xl font-bold text-purple-500">3</p>
          <p class="text-gray-500 mt-1">Workouts This Week</p>
        </div>
 
      </div>
 
      <!-- Recent Activity -->
      <div class="bg-white rounded-xl p-6 shadow">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <ul class="divide-y divide-gray-100">
 
          <li class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-700">Morning Run</p>
              <p class="text-sm text-gray-400">Today, 7:00 AM</p>
            </div>
            <span class="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">5.2 km</span>
          </li>
 
          <li class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-700">Strength Training</p>
              <p class="text-sm text-gray-400">Yesterday, 6:30 PM</p>
            </div>
            <span class="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">45 min</span>
          </li>
 
          <li class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-700">Yoga Session</p>
              <p class="text-sm text-gray-400">Mon, 8:00 AM</p>
            </div>
            <span class="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">30 min</span>
          </li>
 
        </ul>
      </div>
 
    </div>
  </div>
`;
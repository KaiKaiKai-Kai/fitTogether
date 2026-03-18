export const basicDashboard = `
  <div class="min-h-screen bg-gray-100">
 
    <!-- Header -->
    <div class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">FitTogether</h1>
      <button onclick="logout()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
        Log Out
      </button>
    </div>
 
    <!-- Home Only Content -->
    <div class="max-w-2xl mx-auto mt-16 px-4 text-center">
 
      <div class="bg-white rounded-xl p-10 shadow">
        <p class="text-5xl mb-4">👋</p>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome to FitTogether</h2>
        <p class="text-gray-500 mb-6">
          You're logged in as a basic member. Upgrade your account to track workouts, 
          view stats, and connect with friends.
        </p>
        <button class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium">
          Upgrade Account
        </button>
      </div>
 
    </div>
  </div>
`;
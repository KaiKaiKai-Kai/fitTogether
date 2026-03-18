export const modal = `
<div id="contactModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
            <div class="flex items-center justify-center min-h-screen">
                <div class="bg-white w-1/4 p-6 rounded shadow-md">
                    <div class="flex justify-end">
                        <!-- Close Button -->
                        <button id="closeContact" class="text-gray-700 hover:text-red-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <h2 class="text-2xl font-bold mb-4">Urrgh</h2>

                <form action="" method="post">
                        <div class="mb-4">
                            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input type="text" id="name" name="name"
                                class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500">
                        </div>
                        <div class="mb-4">
                            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">password</label>
                            <input type="password" id="password" name="password"
                                class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500">
                        </div>
                        <button type="submit"
                                class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                            Get access
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div id="loginModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
            <div class="flex items-center justify-center min-h-screen">
                <div class="bg-white w-3/4 p-6 rounded shadow-md">
                    <div class="flex justify-end">
                        <!-- Close Button -->
                        <button id="closeLogin" class="text-gray-700 hover:text-red-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <h2 class="text-2xl font-bold mb-4">Hello Sexy</h2>

                <form action="" method="post">
                        <div class="mb-4">
                            <label for="Id" class="block text-gray-700 text-sm font-bold mb-2">ID</label>
                            <input type="text" id="Id" name="Id"
                                class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500">
                        </div>
                        <!--cool-->
                        <div class="flex flex-col items-center justify-center bg-gray-900 text-white">

                            <h1 class="text-2xl mb-6">Select 3 correct options</h1>

                            <div class="grid grid-cols-3 gap-4 mb-6">

                                <button type="button" onclick="toggleOption('a')" class="option px-4 py-3 bg-gray-700 rounded hover:bg-gray-600">A</button>
                                <button type="button" onclick="toggleOption('b')" class="option px-4 py-3 bg-gray-700 rounded hover:bg-gray-600">B</button>
                                <button type="button" onclick="toggleOption('c')" class="option px-4 py-3 bg-gray-700 rounded hover:bg-gray-600">C</button>
                                <button type="button" onclick="toggleOption('d')" class="option px-4 py-3 bg-gray-700 rounded hover:bg-gray-600">D</button>
                                <button type="button" onclick="toggleOption('e')" class="option px-4 py-3 bg-gray-700 rounded hover:bg-gray-600">E</button>
                                <button type="button" onclick="toggleOption('f')" class="option px-4 py-3 bg-gray-700 rounded hover:bg-gray-600">F</button>

                            </div>

                            <button type="button" onclick="checkAnswers()" class="px-6 py-3 bg-blue-500 rounded hover:bg-blue-600">
                                Submit
                            </button>

                            </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
        `
;
export const card = `
    <div class="flex justify-center gap-1">

            
     <!-- Card 1 -->
        <div class="group w-[200px] h-[300px] cursor-pointer [perspective:1000px]">

            <div class="relative w-full h-full transition-transform duration-700
            [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                <div class="absolute w-full h-full flex flex-col items-center justify-center
                rounded-lg border border-black bg-[#353839] text-white
                [backface-visibility:hidden]">

                <h1 class="text-xl font-bold">I Know You</h1>

                </div>

                <div class="absolute w-full h-full flex items-center justify-center
                rounded-lg border border-black bg-[#191970]
                [transform:rotateY(180deg)] [backface-visibility:hidden]">

                <button data-modal="loginModal" class="px-[15px] py-[10px] rounded bg-orange-200 text-black hover:text-white transition">
                    Get In
                </button>

                </div>

            </div>

        </div>

        <!-- Card 2 -->
        <div class="group w-[200px] h-[300px] cursor-pointer [perspective:1000px]">

            <div class="relative w-full h-full transition-transform duration-700
            [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                <div class="absolute w-full h-full flex flex-col items-center justify-center
                rounded-lg border border-black bg-[#353839] text-white
                [backface-visibility:hidden]">

                <h1 class="text-xl font-bold">I Dont know you</h1>

                </div>

                <div class="absolute w-full h-full flex items-center justify-center
                rounded-lg border border-black bg-[#191970]
                [transform:rotateY(180deg)] [backface-visibility:hidden]">

                <button data-modal="contactModal" class="px-[15px] py-[10px] rounded bg-orange-200 text-black hover:text-white transition">
                    Get access
                </button>

                </div>

            </div>

        </div>

    </div>
    `
;
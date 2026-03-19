export function menu() {
  return `
    <div style="background:#141414; border-bottom:1px solid #222; position:sticky; top:0; z-index:100;"
         class="px-6 py-4 flex items-center justify-between">
      <span class="bebas text-2xl" style="color:var(--accent); cursor:pointer"
            onclick="logout()">FitTogether</span>
      <div class="flex gap-2" id="nav-links"></div>
    </div>
  `;
}
 
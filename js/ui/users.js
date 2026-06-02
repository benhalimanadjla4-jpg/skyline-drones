function initUsersModule() {
    const users = [
        { name: "Nadjla", role: "Administrator", status: "Active", email: "nadjla@skyline.dz" },
        { name: "Ahmed", role: "Drone Pilot", status: "On Mission", email: "ahmed@skyline.dz" },
        { name: "Sara", role: "Data Analyst", status: "Offline", email: "sara@skyline.dz" }
    ];

    const tbody = document.getElementById('users-list');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => `
        <tr class="hover:bg-white/5 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                        ${user.name[0]}
                    </div>
                    <div>
                        <div class="text-white font-bold">${user.name}</div>
                        <div class="text-slate-500 text-xs">${user.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-slate-300 text-sm">${user.role}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}">
                    ${user.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <button class="p-2 hover:text-emerald-400 transition-colors"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                <button class="p-2 hover:text-red-400 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
}
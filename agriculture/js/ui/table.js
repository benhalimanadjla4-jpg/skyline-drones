window.initTable = function() {
    const container = document.getElementById('field-diagnostics-container');
    if (!container) return;

    const tbody = container.querySelector('tbody');
    if (!tbody) return;

    const mockData = [
        { name: "North Wheat B1", crop: "Triticum aestivum", status: "Leaf Rust", sev: "Moderate", conf: "92%" },
        { name: "Potato North", crop: "Solanum tuberosum", status: "Late Blight", sev: "High", conf: "94%" },
        { name: "Corn East", crop: "Zea mays", status: "Healthy", sev: "Low", conf: "98%" }
    ];

    tbody.innerHTML = mockData.map(item => {
        let colorClass = item.sev === 'High' ? 'red' : (item.sev === 'Moderate' ? 'orange' : 'emerald');
        return `
        <tr class="hover:bg-white/5 transition-colors group">
            <td class="px-6 py-4">
                <div class="font-bold text-white">${item.name}</div>
                <div class="text-[10px] text-slate-500">${item.crop}</div>
            </td>
            <td class="px-6 py-4">
                <span class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-${colorClass}-500"></span>
                    ${item.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 bg-${colorClass}-500/10 text-${colorClass}-500 rounded-full text-[10px] font-bold">${item.sev}</span>
            </td>
            <td class="px-6 py-4 font-mono text-${colorClass}-400">${item.conf}</td>
            <td class="px-6 py-4 text-right">
                <button class="px-4 py-2 bg-${colorClass}-500/10 text-${colorClass}-400 rounded-xl text-xs font-bold group-hover:bg-${colorClass}-500 group-hover:text-white transition-all">View Advice</button>
            </td>
        </tr>
    `}).join('');
    
    if(window.lucide) lucide.createIcons();
};
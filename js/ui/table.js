/**
 * Skyline Drones Telemetry Table
 * Version: 1.0.0 - Neon Status Icons
 */

function initDronesTable() {
    const tableBody = document.getElementById('drones-table-body');
    const loadingDiv = document.getElementById('table-loading');
    if (!tableBody || !loadingDiv) return;

    // 1. البيانات (المكونات)
    const dronesData = [
        { id: "SKY-A01", model: "Interceptor X1", status: "Active", altitude: 125, battery: 84 },
        { id: "SKY-A03", model: "Scout MK2", status: "Maintenance", altitude: 0, battery: 15 },
        { id: "SKY-B11", model: "Watcher X1", status: "Active", altitude: 110, battery: 72 },
        { id: "SKY-C02", model: "Interceptor X1", status: "Active", altitude: 95, battery: 96 },
        { id: "SKY-D99", model: "Cargo V1", status: "Returning", altitude: 80, battery: 60 },
        { id: "SKY-Z07", model: "Scout MK2", status: "Critical", altitude: 210, battery: 8 }
    ];

    // 2. تفريغ الجدول القديم (للتأكد)
    tableBody.innerHTML = '';

    // 3. بناء الصفوف (الرسم على الشاشة)
    // داخل حلقة dronesData.forEach(drone)
dronesData.forEach(drone => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-[#1f293a]/30 transition-colors group cursor-pointer border-b border-white/5';

    row.innerHTML = `
        <td class="px-6 py-4 font-bold text-white tracking-tight">${drone.id}</td>
        <td class="px-5 py-4 text-slate-300 font-medium">${drone.model}</td>
        
        <td class="px-5 py-4">${getStatusBadge(drone.status)}</td>
        
        <td class="px-5 py-4 text-center font-black text-slate-200">${drone.altitude}m</td>
        
        <td class="px-5 py-4 text-center">${getBatteryLevel(drone.battery)}</td>
        
        <td class="px-5 py-4 text-right">
            <button class="p-1.5 rounded-lg text-slate-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all opacity-0 group-hover:opacity-100">
                <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
        </td>
    `;
    tableBody.appendChild(row);
});

    // 4. إخفاء مؤشر التحميل
    loadingDiv.classList.add('hidden');

    // 5. [الأهم]: استدعاء المترجم الآن بعد أن أصبح الجدول مليئاً بالبيانات
    if (typeof updatePageText === 'function') {
        const currentLang = localStorage.getItem('skyline_lang') || 'en';
        updatePageText(currentLang);
    }
}
    // 2. دالة لإنشاء شارة الحالة (Status Badge) بالنيون
   function getStatusBadge(status) {
    let color = "slate";
    let glow = "transparent";
    // تحويل الحالة لنص صغير للترجمة (Active -> active)
    let statusKey = status.toLowerCase();

    switch (status) {
        case "Active": color = "cyan"; glow = "#06b6d4"; break;
        case "Critical": color = "red"; glow = "#ef4444"; break;
        case "Returning": color = "amber"; glow = "#f59e0b"; break;
        case "Maintenance": color = "emerald"; glow = "#10b981"; break;
    }

    return `
        <div class="flex items-center gap-2.5">
            <span class="flex h-1.5 w-1.5 rounded-full bg-${color}-500 animate-pulse" style="box-shadow: 0 0 8px ${glow};"></span>
            <span data-key="${statusKey}" class="text-${color}-400 text-xs font-bold whitespace-nowrap">${status}</span>
        </div>
    `;
}

    // 3. دالة لإنشاء شريط البطارية الملون (Battery Bar)
    function getBatteryLevel(battery) {
        let color = "cyan";
        if (battery < 20) color = "red";
        else if (battery < 50) color = "amber";

        return `
            <div class="flex items-center gap-3 justify-center">
                <div class="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-${color}-500 rounded-full" style="width: ${battery}%;"></div>
                </div>
                <span class="text-xs font-medium text-slate-300 w-8 text-right">${battery}%</span>
            </div>
        `;
    }

    // 4. ملء الجدول بالبيانات
    dronesData.forEach(drone => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-[#1f293a]/30 transition-colors group cursor-pointer';

        row.innerHTML = `
            <td class="px-6 py-4 font-bold text-white tracking-tight">${drone.id}</td>
            <td class="px-5 py-4 text-slate-300 font-medium">${drone.model}</td>
            <td class="px-5 py-4">${getStatusBadge(drone.status)}</td>
            <td class="px-5 py-4 text-center font-black text-slate-200">${drone.altitude}m</td>
            <td class="px-5 py-4 text-center">${getBatteryLevel(drone.battery)}</td>
            <td class="px-5 py-4 text-right">
                <button class="p-1.5 rounded-lg text-slate-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all opacity-0 group-hover:opacity-100">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        tableBody.appendChild(row);
    });

    // 5. إخفاء مؤشر التحميل بعد الانتهاء
    loadingDiv.classList.add('hidden');

    // تهيئة الأيقونات الجديدة
    if (window.lucide) lucide.createIcons();

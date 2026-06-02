window.initFleetMap = function() {
    const container = document.getElementById('fleet-map');
    if (!container) return;

    // التأكد من عدم إنشاء الخريطة مرتين
    if (container._leaflet_id) {
        return;
    }

    // إعداد الخريطة في إحداثيات افتراضية تناسب حقلاً زراعياً
    const map = L.map('fleet-map', {
        zoomControl: false,
        attributionControl: false
    }).setView([30.0444, 31.2357], 15); 

    // إضافة طبقة خريطة قمر صناعي (Satellite) تناسب المظهر الداكن وتظهر الحقول بوضوح
    // دمجناها مع مظهر داكن عن طريق CSS بداخل الحاوية
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        className: 'opacity-80 grayscale-[20%] contrast-125 hue-rotate-15'
    }).addTo(map);

    // أيقونة مخصصة للدرون على الخريطة لتناسب الـ UI
    const droneIcon = L.divIcon({
        className: 'custom-drone-marker',
        html: `
            <div class="relative flex items-center justify-center w-12 h-12">
                <div class="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                <div class="relative bg-[#111827] border-2 border-emerald-500 rounded-full p-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <i data-lucide="navigation" class="w-4 h-4 text-emerald-400"></i>
                </div>
            </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
    });

    // إضافة بعض الدرونات
    L.marker([30.0460, 31.2350], {icon: droneIcon}).addTo(map);
    L.marker([30.0420, 31.2380], {icon: droneIcon}).addTo(map);

    // تحديد قطاع الحقل (Polygon Sector) كما هو مطلوب في مشاريع الزراعة
    const sectorCoords = [
        [30.0470, 31.2320],
        [30.0470, 31.2400],
        [30.0410, 31.2400],
        [30.0410, 31.2320]
    ];
    L.polygon(sectorCoords, {
        color: '#10b981',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.1,
        dashArray: '5, 10'
    }).addTo(map).bindPopup('<div class="text-xs font-bold text-slate-800">North Sector - Potato Field<br/>Status: Scanning</div>');

    // تحديد قطاع مصاب (Red Sector)
    const infectedCoords = [
        [30.0440, 31.2330],
        [30.0440, 31.2350],
        [30.0420, 31.2350],
        [30.0420, 31.2330]
    ];
    L.polygon(infectedCoords, {
        color: '#ef4444',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.2
    }).addTo(map).bindPopup('<div class="text-xs font-bold text-slate-800">Alert: Early Blight Detected<br/>Action: Immediate Spray required</div>');

    // حل مشكلة تحميل الخريطة (Leaflet container fix)
    setTimeout(() => {
        map.invalidateSize();
    }, 500);

    // إعادة استدعاء الأيقونات
    if(window.lucide) lucide.createIcons();
};

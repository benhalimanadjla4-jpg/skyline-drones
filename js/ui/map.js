function initFleetMap() {
    const mapElement = document.getElementById('leaflet-map-container');
    if (!mapElement) {
        console.error("Map container not found!");
        return;
    }

    // إعداد الخريطة
    const map = L.map('leaflet-map-container', {
        zoomControl: false,
        attributionControl: false
    }).setView([35.12, -0.63], 13); 

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    const droneIcon = L.divIcon({
        className: 'custom-drone-icon',
        html: `<div class="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-pulse"></div>`,
        iconSize: [12, 12]
    });

    L.marker([35.12, -0.63], {icon: droneIcon}).addTo(map);

    // سطر سحري: يحل مشكلة ظهور الخريطة بشكل مقصوص أو رمادي
    setTimeout(() => {
        map.invalidateSize();
    }, 400);
}



function initMissionMap() {
    // إحداثيات افتراضية (يمكنك تغييرها لموقع مشروعك)
    const map = L.map('missionMap').setView([36.75, 3.05], 13); // مثلاً الجزائر العاصمة

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // إضافة ماركر للدرون بتصميم مخصص (دائرة نيون)
    const droneIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-[0_0_15px_#22D3EE] animate-pulse"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker([36.75, 3.05], { icon: droneIcon }).addTo(map)
        .bindPopup('<b>Drone SKY-01</b><br>Analyzing Crop Health...')
        .openPopup();
}
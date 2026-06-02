/**
 * Skyline Dashboard Core Logic
 * Version: 1.1.0 - Fixed Async Component Loading
 */

document.addEventListener('DOMContentLoaded', async () => {
    initLanguage();

    await Promise.all([
        loadComponent('sidebar-container', '/skyline-drones/components/sidebar.html'),
        loadComponent('topbar-container', '/skyline-drones/components/topbar.html'),
        loadComponent('stats-grid', '/skyline-drones/components/cards.html')
    ]);

    applyScrollAnimations();
    
    if (typeof updatePageText === 'function') {
        const savedLang = localStorage.getItem('skyline_lang') || 'en';
        updatePageText(savedLang);
    }
});

async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const res = await fetch(filePath);
        container.innerHTML = await res.text();

        if(containerId === 'missions-chart') setTimeout(initMissionsChart, 150);
        if(containerId === 'fleet-map') setTimeout(initFleetMap, 250);
        if(containerId === 'drones-table') setTimeout(initDronesTable, 200);

        document.dispatchEvent(new Event('componentsLoaded'));
    } catch (e) {
        console.error('Load error:', e)
    }
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('aside a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split("/").pop();
        if (linkHref === currentPath) {
            link.classList.add('active-nav-item');
        } else {
            link.classList.remove('active-nav-item');
        }
    });
}

function initLanguage() {
    const savedLang = localStorage.getItem('skyline_lang') || 'en';
    const htmlTag = document.documentElement;
    
    htmlTag.setAttribute('lang', savedLang);
    htmlTag.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    
    document.body.style.fontFamily = savedLang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif";
}

function applyScrollAnimations() {
    const cards = document.querySelectorAll('.animate-fade-in');
    cards.forEach((card, index) => {
        card.style.opacity = "0"; 
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.animationDelay = `${index * 0.1}s`;
        }, 50);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    initLanguage();

    await Promise.all([
        loadComponent('sidebar-container', '/skyline-drones/components/sidebar.html'),
        loadComponent('topbar-container', '/skyline-drones/components/topbar.html'),
        loadComponent('stats-grid', '/skyline-drones/components/cards.html'),
        loadComponent('missions-chart', '/skyline-drones/components/missions-chart.html'),
        loadComponent('fleet-map', '/skyline-drones/components/fleet-map.html'),
        loadComponent('drones-table', '/skyline-drones/components/drones-table.html')
    ]);

    applyScrollAnimations();

    if (typeof initMissionsChart === 'function') {
        initMissionsChart();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    initLanguage();

    await Promise.all([
        loadComponent('sidebar-container', '/skyline-drones/components/sidebar.html'),
        loadComponent('topbar-container', '/skyline-drones/components/topbar.html'),
        loadComponent('stats-grid', '/skyline-drones/components/cards.html'),
        loadComponent('missions-chart', '/skyline-drones/components/missions-chart.html'),
        loadComponent('fleet-map', '/skyline-drones/components/fleet-map.html')
    ]);

    if (typeof initMissionsChart === 'function') {
        initMissionsChart();
    }

    if (typeof initFleetMap === 'function') {
        setTimeout(initFleetMap, 200);
    }

    applyScrollAnimations();
    if (window.lucide) lucide.createIcons();
});

function initFleetMap() {
    const mapElement = document.getElementById('leaflet-map-container');
    if (!mapElement) return;

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

    L.marker([35.12, -0.63], {icon: droneIcon}).addTo(map)
        .bindPopup('<div class="bg-slate-900 text-white p-2 rounded">Drone-082 Active</div>');
}

if (typeof initDronesTable === 'function') {
    initDronesTable();
}

document.addEventListener('componentsLoaded', () => {
    lucide.createIcons();
    updateAILiveIntel();
    initDarkMode();
    toggleNotifications();
    setupSearch();
    highlightActiveLink();
    console.log("🚀 SKYLINE DASHBOARD ✅ كل شيء يعمل");
});

function updateAILiveIntel() {
    const intelBox = document.getElementById('intel-engine');
    if(!intelBox) return;
    if(window.aiInterval) clearInterval(window.aiInterval);

    window.aiInterval = setInterval(() => {
        const healthValue = intelBox.querySelector('#health-value');
        const healthBar = intelBox.querySelector('#health-bar');
        const ndviValue = intelBox.querySelector('#ndvi-value');

        let newHealth = (92.4 + (Math.random() * 0.7 - 0.35)).toFixed(1);
        
        healthValue.style.opacity = 0;
        setTimeout(() => {
            healthValue.innerText = `${newHealth}%`;
            healthBar.style.width = `${newHealth}%`;
            healthValue.style.opacity = 1;

            if(ndviValue) ndviValue.innerText = `+${(0.78 + Math.random()*0.07).toFixed(2)}`;
        }, 150);

    }, 2500);
}

function initDarkMode() {
    const saved = localStorage.getItem('skyline_theme') || 'dark';
    applyTheme(saved);
}

function applyTheme(mode) {
    const btn = document.getElementById('theme-btn');
    if(!btn) return;
    
    if(mode === 'light'){
        document.body.classList.add('light-mode');
        btn.innerHTML = '<i data-lucide="sun" class="w-5 h-5 group-active:scale-95 transition-transform duration-300"></i>';
        btn.className = "relative overflow-hidden p-2.5 text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:border-amber-400/60 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.15)] group";
    } else {
        document.body.classList.remove('light-mode');
        btn.innerHTML = '<i data-lucide="moon" class="w-5 h-5 group-active:scale-95 transition-transform duration-300"></i>';
        btn.className = "relative overflow-hidden p-2.5 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-500 rounded-xl transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] group";
    }
    if(window.lucide) {
        lucide.createIcons({ root: btn });
    }
}

window.toggleThemeVisual = function() {
    let mode = localStorage.getItem('skyline_theme') || 'dark';
    mode = mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('skyline_theme', mode);
    applyTheme(mode);
};

function toggleNotifications() {}

window.toggleNotifyPanel = function() {
    const lang = localStorage.getItem('skyline_lang') || 'en';
    alert(lang === 'ar' ? "🔔 نظام سكايلاين: جميع درونات الأسطول تعمل بكفاءة." : "🔔 Skyline System: All fleet drones are operational.");
    const dot = document.getElementById('notify-dot');
    if(dot) dot.style.display = 'none';
};

window.runSystemCheck = function() {
    window.location.href = '/skyline-drones/pages/settings/settings.html';
};

function setupSearch() {
    const search = document.getElementById('global-search');
    if(!search) return;
    search.addEventListener('input', e => {
        document.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? '' : 'none';
        })
    })
}

function syncUserUI() {
    const name = localStorage.getItem('skyline_user_name');
    const avatar = localStorage.getItem('skyline_user_avatar');

    const nameElements = document.querySelectorAll('#topbar-user-name');
    const avatarElements = document.querySelectorAll('#topbar-user-avatar');

    nameElements.forEach(el => { if(name) el.textContent = name; });
    avatarElements.forEach(el => { if(avatar) el.src = avatar; });
}

document.addEventListener('DOMContentLoaded', syncUserUI);
window.addEventListener('storage', syncUserUI);
window.addEventListener('profileUpdated', syncUserUI);
setInterval(syncUserUI, 1000);

window.logout = function() {
    window.location.href = '/skyline-drones/login.html';
};
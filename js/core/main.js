/**
 * Skyline Dashboard Core Logic
 * Version: 1.1.0 - Fixed Async Component Loading
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. تهيئة اللغة أولاً لضمان عدم حدوث "قفزة" في التصميم
    initLanguage();

    // 2. تحميل المكونات المشتركة بشكل متزامن لضمان ترتيب العناصر
    // استخدمنا await لضمان تحميل العناصر قبل البدء بتنفيذ أي منطق عليها
    await Promise.all([
        loadComponent('sidebar-container', 'components/sidebar.html'),
        loadComponent('topbar-container', 'components/topbar.html'),
        loadComponent('stats-grid', 'components/cards.html')
    ]);

    // 3. الآن بعد أن تأكدنا أن العناصر موجودة في الـ DOM، نطبق التأثيرات
    applyScrollAnimations();
    
    // تحديث نصوص الترجمة بعد تحميل كل المكونات
    if (typeof updatePageText === 'function') {
        const savedLang = localStorage.getItem('skyline_lang') || 'en';
        updatePageText(savedLang);
    }
});

/**
 * دالة لجلب مكون HTML ووضعه في حاوية معينة (نسخة محسنة)
 */
async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const res = await fetch(filePath);
        container.innerHTML = await res.text();

        // تشغيل المكونات الخاصة
        if(containerId === 'missions-chart') setTimeout(initMissionsChart, 150);
        if(containerId === 'fleet-map') setTimeout(initFleetMap, 250);
        if(containerId === 'drones-table') setTimeout(initDronesTable, 200);

        document.dispatchEvent(new Event('componentsLoaded'));
    } catch (e) {
        console.error('Load error:', e)
    }
}

/**
 * تلوين الرابط الحالي في القائمة الجانبية
 */
function highlightActiveLink() {
    // الحصول على اسم الملف الحالي فقط (مثل index.html)
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

/**
 * تهيئة اللغة عند بدء التشغيل
 */
function initLanguage() {
    const savedLang = localStorage.getItem('skyline_lang') || 'en';
    const htmlTag = document.documentElement;
    
    htmlTag.setAttribute('lang', savedLang);
    htmlTag.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    
    document.body.style.fontFamily = savedLang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif";
}

/**
 * تطبيق حركات الظهور (Fade-in)
 */
function applyScrollAnimations() {
    // استهداف البطاقات التي تم تحميلها للتو
    const cards = document.querySelectorAll('.animate-fade-in');
    cards.forEach((card, index) => {
        // نضمن إعادة تعيين الـ opacity إذا كانت محددة في الـ CSS كـ 0
        card.style.opacity = "0"; 
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.animationDelay = `${index * 0.1}s`;
        }, 50);
    });
}
document.addEventListener('DOMContentLoaded', async () => {
    initLanguage();

    // 1. تحميل المكونات
   await Promise.all([
    loadComponent('sidebar-container', '/components/sidebar.html'),
    loadComponent('topbar-container', '/components/topbar.html'),
    loadComponent('stats-grid', '/components/cards.html'),
    loadComponent('missions-chart', '/components/missions-chart.html'),
    loadComponent('fleet-map', '/components/fleet-map.html'),
    loadComponent('drones-table', '/components/drones-table.html')
   
]);

    // 2. تشغيل الأنميشن
    applyScrollAnimations();

    // 3. تشغيل الرسم البياني (استدعاء الدالة بعد التأكد من وجود الـ Canvas)
    if (typeof initMissionsChart === 'function') {
        initMissionsChart();
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    // 1. تهيئة اللغة
    initLanguage();

    // 2. تحميل كافة المكونات (بما فيها الخريطة)
    await Promise.all([
        loadComponent('sidebar-container', '/components/sidebar.html'),
        loadComponent('topbar-container', '/components/topbar.html'),
        loadComponent('stats-grid', '/components/cards.html'),
        loadComponent('missions-chart', '/components/missions-chart.html'),
        loadComponent('fleet-map', '/components/fleet-map.html') // السطر الناقص كان هنا
    ]);

    // 3. تشغيل الرسم البياني
    if (typeof initMissionsChart === 'function') {
        initMissionsChart();
    }

    // 4. تشغيل الخريطة (هذا السطر كان ناقصاً أيضاً)
    if (typeof initFleetMap === 'function') {
        setTimeout(initFleetMap, 200); // تأخير بسيط لضمان استقرار حاوية الخريطة
    }

    // 5. الأنميشن والأيقونات
    applyScrollAnimations();
    if (window.lucide) lucide.createIcons();
});
function initFleetMap() {
    const mapElement = document.getElementById('leaflet-map-container');
    if (!mapElement) return;

    // 1. إعداد الخريطة وتحديد موقع المركز (مثلاً إحداثيات الجزائر أو موقع مشروعك)
    const map = L.map('leaflet-map-container', {
        zoomControl: false, // إخفاء أزرار التحكم الافتراضية لشكل أنظف
        attributionControl: false
    }).setView([35.12, -0.63], 13); 

    // 2. استخدام خريطة CartoDB Dark (أفضل خريطة سوداء للمشاريع الاحترافية)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    // 3. إضافة درون (Marker) بتصميم نيون متوهج
    const droneIcon = L.divIcon({
        className: 'custom-drone-icon',
        html: `<div class="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-pulse"></div>`,
        iconSize: [12, 12]
    });

    // إضافة ماركر تجريبي
    L.marker([35.12, -0.63], {icon: droneIcon}).addTo(map)
        .bindPopup('<div class="bg-slate-900 text-white p-2 rounded">Drone-082 Active</div>');
}
// داخل main.js بعد تحميل المكونات
if (typeof initDronesTable === 'function') {
    initDronesTable();
}


// ✅ الدوال الان تعمل دائما حتى بعد تغيير الصفحات

/**
 * 🔴 المشكلة الاولى تم اصلاحها: تشغيل الدوال فقط بعد تحميل جميع المكونات
 */
// ✅ ✅ ✅ كل عملنا كاملاً كما كان يعمل كل شيء
document.addEventListener('componentsLoaded', () => {
    // 👇 كل الدوال تعمل الان بالترتيب الصحيح
    lucide.createIcons();
    updateAILiveIntel();
    initDarkMode();
    toggleNotifications();
    setupSearch();
    highlightActiveLink();
    console.log("🚀 SKYLINE DASHBOARD ✅ كل شيء يعمل");
});


// ✅ مؤشرات الذكاء الاصطناعي
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


// ✅ نظام الوضع الداكن
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

// ✅ زر الجرس والتنبيهات
function toggleNotifications() {
    // No longer doing complex query selectors because the button has onclick="toggleNotifyPanel()"
}

window.toggleNotifyPanel = function() {
    const lang = localStorage.getItem('skyline_lang') || 'en';
    alert(lang === 'ar' ? "🔔 نظام سكايلاين: جميع درونات الأسطول تعمل بكفاءة." : "🔔 Skyline System: All fleet drones are operational.");
    const dot = document.getElementById('notify-dot');
    if(dot) dot.style.display = 'none';
};

window.runSystemCheck = function() {
    window.location.href = '/pages/settings/settings.html';
};


// ✅ البحث العالمي
function setupSearch() {
    const search = document.getElementById('global-search');
    if(!search) return;
    search.addEventListener('input', e => {
        document.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? '' : 'none';
        })
    })
}

// وظيفة التحديث الفوري للعناصر
function syncUserUI() {
    const name = localStorage.getItem('skyline_user_name');
    const avatar = localStorage.getItem('skyline_user_avatar');

    const nameElements = document.querySelectorAll('#topbar-user-name');
    const avatarElements = document.querySelectorAll('#topbar-user-avatar');

    nameElements.forEach(el => { if(name) el.textContent = name; });
    avatarElements.forEach(el => { if(avatar) el.src = avatar; });
}

// 1. تحديث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', syncUserUI);

// 2. تحديث عند حدوث تغيير في التخزين (LocalStorage) من تبويب آخر
window.addEventListener('storage', syncUserUI);

// 3. تحديث عند إرسال حدث يدوي من صفحة الإعدادات
window.addEventListener('profileUpdated', syncUserUI);

// 4. خطة الأمان: التحديث كل ثانية للتأكد من المزامنة (اختياري لكنه مضمون)
setInterval(syncUserUI, 1000);

// 5. مسار تسجيل الخروج (Logout)
window.logout = function() {
    // يمكنك مسح بيانات الجلسة من هنا مستقبلاً
    // localStorage.clear();
    
    // التوجيه لصفحة تسجيل الدخول
    window.location.href = '/login.html';
};
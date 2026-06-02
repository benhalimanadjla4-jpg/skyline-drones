/**
 * Skyline Dashboard Core Logic - v1.2.0
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. تهيئة اللغة
    initLanguage();

    // 2. تحميل المكونات بشكل متزامن
    await Promise.all([
        loadComponent('sidebar-container', 'components/sidebar.html'),
        loadComponent('topbar-container', 'components/topbar.html'),
        loadComponent('stats-grid', 'components/cards.html')
    ]);

    // Apply translations on dynamically loaded components
    if (typeof applyLanguage === 'function') {
        applyLanguage(localStorage.getItem('skyline_lang') || 'en');
    }

    // 3. تشغيل الدوال البرمجية بعد التأكد من وجود الحاويات في الصفحة
    if (typeof initCharts === 'function') initCharts();
    if (typeof initTable === 'function') initTable();
    if (typeof initFleetMap === 'function') {
        setTimeout(initFleetMap, 300); // تأخير بسيط لضمان استقرار حاوية الخريطة
    }

    // 4. تشغيل الأنظمة الفرعية
    updateAILiveIntel();
    initDarkMode();
    setupSearch();
    highlightActiveLink();
    syncUserUI();

    // 5. تشغيل الأيقونات
    if (window.lucide) lucide.createIcons();
    
    document.dispatchEvent(new Event('componentsLoaded'));
    console.log("🚀 SKYLINE DASHBOARD ✅ كل شيء يعمل بنجاح");
});

async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const res = await fetch(filePath);
        if (res.ok) {
            container.innerHTML = await res.text();
            
            // Rewrite absolute paths for local file:// usage
            const isInsidePages = window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\');
            container.querySelectorAll('a[href^="/agriculture/"]').forEach(a => {
                let href = a.getAttribute('href').replace('/agriculture/', '');
                a.setAttribute('href', isInsidePages ? '../' + href : './' + href);
            });
            container.querySelectorAll('img[src^="/assets/"]').forEach(img => {
                let src = img.getAttribute('src').replace('/assets/', '');
                img.setAttribute('src', isInsidePages ? '../../assets/' + src : '../assets/' + src);
            });

            // Re-sync UI for topbar
            if (containerId === 'topbar-container' && typeof syncUserUI === 'function') {
                syncUserUI();
            }
        }
    } catch (e) {
        console.error(`Error loading ${filePath}:`, e);
    }
}

// --- الأنظمة المساعدة ---

function initLanguage() {
    const savedLang = localStorage.getItem('skyline_lang') || 'en';
    document.documentElement.setAttribute('lang', savedLang);
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
}

function updateAILiveIntel() {
    const intelBox = document.getElementById('intel-engine');
    if(!intelBox) return;
    setInterval(() => {
        const healthValue = document.getElementById('health-value');
        const ndviValue = document.getElementById('ndvi-value');
        if(healthValue) {
            let val = (82 + (Math.random() * 2)).toFixed(1);
            healthValue.innerText = `${val}%`;
        }
    }, 3000);
}

function initDarkMode() {
    const theme = localStorage.getItem('skyline_theme') || 'dark';
    if(theme === 'light') document.body.classList.add('light-mode');
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('aside a').forEach(link => {
        if (link.getAttribute('href').includes(currentPath)) {
            link.classList.add('bg-cyan-500/10', 'text-cyan-400');
        }
    });
}

function setupSearch() {
    const search = document.getElementById('global-search');
    if(!search) return;
    search.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
        });
    });
}

function syncUserUI() {
    const name = localStorage.getItem('skyline_user_name') || 'nadjla benhalima';
    const email = localStorage.getItem('skyline_user_email') || 'nadjla@skyline-land.dz';
    const avatar = localStorage.getItem('skyline_user_avatar') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
    
    // Topbar & Dropdown logic
    const topbarName = document.getElementById('topbar-user-name');
    if(topbarName) topbarName.textContent = name;
    
    const dropdownName = document.getElementById('dropdown-user-name');
    if(dropdownName) dropdownName.textContent = name;

    const dropdownEmail = document.getElementById('dropdown-user-email');
    if(dropdownEmail) dropdownEmail.textContent = email;
    
    const topbarImg = document.getElementById('topbar-user-img');
    if(topbarImg) topbarImg.src = avatar;

    // Settings page logic
    const settingsNameInput = document.getElementById('settings-name-input');
    if(settingsNameInput) settingsNameInput.value = name;
    
    const settingsEmailInput = document.getElementById('settings-email-input');
    if(settingsEmailInput) settingsEmailInput.value = email;
    
    const settingsImg = document.getElementById('profile-img');
    if(settingsImg && !settingsImg.dataset.loaded) {
        settingsImg.src = avatar;
        settingsImg.dataset.loaded = 'true';
    }
}

window.logout = () => {
    // تحديد المسار الأساسي الجديد
    const loginPath = '/agriculture/login.html';
    
    // التحقق مما إذا كنا داخل مجلد صفحات فرعي لتعديل المسار النسبي
    if (window.location.pathname.includes('/pages/')) {
        // العودة مستويين للخلف ثم الدخول لمجلد agriculture
        window.location.href = '../../agriculture/login.html';
    } else {
        // العودة مستوى واحد للخلف (إذا كنت في الجذر أو مجلد قريب)
        window.location.href = '../agriculture/login.html';
    }
};

window.toggleDropdown = function(id, event) {
    if(event) event.stopPropagation();
    
    const dropdown = document.getElementById(id);
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    
    allDropdowns.forEach(menu => {
        if(menu.id !== id && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
        }
    });

    if(dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

document.addEventListener('click', (e) => {
    const isDropdownButton = e.target.closest('[onclick^="toggleDropdown"]');
    const isDropdownMenu = e.target.closest('.dropdown-menu');
    
    if(!isDropdownButton && !isDropdownMenu) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    }
});

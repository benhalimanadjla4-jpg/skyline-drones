/**
 * Skyline Dashboard Core Logic
 * Version: 3.0.0 - Final Fix
 */

/* ══════════════════════════════════════
   LOAD COMPONENT
══════════════════════════════════════ */
async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        // مسار ثابت دائماً بغض النظر عن موقع الصفحة
        const fullPath = window.location.origin + '/skyline-drones/components/' + filePath.replace(/^.*components\//, '').replace(/^\//, '');
        const res = await fetch(fullPath);
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${fullPath}`);
        container.innerHTML = await res.text();
    } catch (e) {
        console.error('loadComponent error:', e);
    }
}

/* ══════════════════════════════════════
   LANGUAGE / THEME
══════════════════════════════════════ */
function initLanguage() {
    const savedLang = localStorage.getItem('skyline_lang') || 'en';
    document.documentElement.setAttribute('lang', savedLang);
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    document.body.style.fontFamily = savedLang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif";
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('aside a').forEach(link => {
        const linkHref = (link.getAttribute('href') || '').split('/').pop();
        link.classList.toggle('active-nav-item', linkHref === currentPath);
    });
}

function applyScrollAnimations() {
    document.querySelectorAll('.animate-fade-in').forEach((card, i) => {
        card.style.opacity = '0';
        setTimeout(() => { card.style.opacity = '1'; card.style.animationDelay = `${i * 0.1}s`; }, 50);
    });
}

/* ══════════════════════════════════════
   DARK MODE
══════════════════════════════════════ */
function initDarkMode() {
    const saved = localStorage.getItem('skyline_theme') || 'dark';
    applyTheme(saved);
}

function applyTheme(mode) {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;
    if (mode === 'light') {
        document.body.classList.add('light-mode');
        btn.innerHTML = '<i data-lucide="sun" class="w-5 h-5"></i>';
        btn.className = "relative overflow-hidden p-2.5 text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:border-amber-400/60 rounded-xl transition-all duration-300 group";
    } else {
        document.body.classList.remove('light-mode');
        btn.innerHTML = '<i data-lucide="moon" class="w-5 h-5"></i>';
        btn.className = "relative overflow-hidden p-2.5 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-500 rounded-xl transition-all duration-300 group";
    }
    if (window.lucide) lucide.createIcons({ root: btn });
}

window.toggleThemeVisual = function () {
    let mode = localStorage.getItem('skyline_theme') || 'dark';
    mode = mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('skyline_theme', mode);
    applyTheme(mode);
};

/* ══════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════ */
window.toggleNotifyPanel = function () {
    const lang = localStorage.getItem('skyline_lang') || 'en';
    alert(lang === 'ar'
        ? '🔔 نظام سكايلاين: جميع درونات الأسطول تعمل بكفاءة.'
        : '🔔 Skyline System: All fleet drones are operational.');
    const dot = document.getElementById('notify-dot');
    if (dot) dot.style.display = 'none';
};

window.runSystemCheck = function () {
    window.location.href = '/skyline-drones/pages/settings/settings.html';
};

/* ══════════════════════════════════════
   GLOBAL SEARCH
══════════════════════════════════════ */
function setupSearch() {
    const search = document.getElementById('global-search');
    if (!search) return;
    search.addEventListener('input', e => {
        document.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? '' : 'none';
        });
    });
}

/* ══════════════════════════════════════
   USER UI SYNC
══════════════════════════════════════ */
function syncUserUI() {
    const name   = localStorage.getItem('skyline_user_name');
    const avatar = localStorage.getItem('skyline_user_avatar');
    document.querySelectorAll('#topbar-user-name').forEach(el => { if (name) el.textContent = name; });
    document.querySelectorAll('#topbar-user-avatar').forEach(el => { if (avatar) el.src = avatar; });
}

window.logout = function () {
    window.location.href = '/skyline-drones/login.html';
};

/* ══════════════════════════════════════
   SINGLE DOMContentLoaded
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
    initLanguage();

    // تحميل المكونات — مسار ثابت دائماً
    await Promise.all([
        loadComponent('sidebar-container', 'sidebar.html'),
        loadComponent('topbar-container',  'topbar.html'),
    ]);

    // بعد تحميل المكونات
    if (window.lucide) lucide.createIcons();
    highlightActiveLink();
    initDarkMode();
    setupSearch();
    syncUserUI();
    applyScrollAnimations();

    if (typeof updatePageText === 'function') {
        updatePageText(localStorage.getItem('skyline_lang') || 'en');
    }

    setInterval(syncUserUI, 1000);
});

window.addEventListener('storage',        syncUserUI);
window.addEventListener('profileUpdated', syncUserUI);
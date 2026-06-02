/**
 * Skyline Missions Bar Chart - Neon Style
 * يتم استدعاؤها بعد تحميل المكون ديناميكياً
 */
function initMissionsChart() {
    const canvas = document.getElementById('missionsBarChart');
    if (!canvas) return; // حماية لضمان عدم حدوث خطأ إذا لم يوجد العنصر

    const ctx = canvas.getContext('2d');
    
    // إنشاء التدرج اللوني النيوني (أزرق سيان متوهج)
    let neonGradient = ctx.createLinearGradient(0, 0, 0, 400);
    neonGradient.addColorStop(0, 'rgba(34, 211, 238, 1)');   // Cyan ساطع
    neonGradient.addColorStop(1, 'rgba(34, 211, 238, 0.05)'); // شفافية عالية للنهاية

    // تهيئة الرسم البياني
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Completed Missions',
                data: [45, 60, 40, 50, 65, 30, 52, 60, 45],
                backgroundColor: neonGradient,
                borderColor: 'rgba(34, 211, 238, 1)',
                borderWidth: 1.5,
                borderRadius: 10, // تدوير الزوايا كما في الصورة
                borderSkipped: false,
                barThickness: 14, // عرض العمود
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: 'rgba(148, 163, 184, 0.7)', font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(30, 41, 59, 0.3)', drawBorder: false },
                    ticks: { 
                        color: 'rgba(148, 163, 184, 0.7)',
                        callback: value => value + 'k' // إضافة k للأرقام
                    },
                    suggestedMax: 80
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827',
                    titleColor: '#fff',
                    cornerRadius: 10,
                    padding: 10,
                    borderColor: 'rgba(34, 211, 238, 0.3)',
                    borderWidth: 1
                }
            }
        }
    });
}


/**
 * تهيئة الرسوم البيانية لصفحة التحليلات
 * Skyline LAND - Analytics UI
 */
function initAnalyticsCharts() {
    // 1. رسم بياني لمؤشر صحة المحاصيل (Line Chart)
    const ctxHealth = document.getElementById('cropHealthChart').getContext('2d');
    
    // إنشاء تدرج لوني للخلفية
    const healthGradient = ctxHealth.createLinearGradient(0, 0, 0, 400);
    healthGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)'); // Emerald
    healthGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    new Chart(ctxHealth, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'NDVI Index',
                data: [0.65, 0.72, 0.68, 0.85, 0.92, 0.88],
                borderColor: '#10B981',
                borderWidth: 3,
                fill: true,
                backgroundColor: healthGradient,
                tension: 0.4,
                pointBackgroundColor: '#10B981',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });

    // 2. رسم بياني لأداء الأسطول (Bar Chart)
    const ctxFleet = document.getElementById('fleetPerformanceChart').getContext('2d');
    
    new Chart(ctxFleet, {
        type: 'bar',
        data: {
            labels: ['Drone A', 'Drone B', 'Drone C', 'Drone D', 'Drone E'],
            datasets: [{
                label: 'Flight Hours',
                data: [120, 150, 80, 190, 140],
                backgroundColor: 'rgba(6, 182, 212, 0.6)', // Cyan
                borderColor: '#06B6D4',
                borderWidth: 1,
                borderRadius: 8,
                hoverBackgroundColor: '#06B6D4'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });
}
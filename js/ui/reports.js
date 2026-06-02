// تعريف متغير عالمي للرسم البياني لمنع التكرار
let adminGlobalChart = null;

function initAdminCharts() {
    const ctxGlobal = document.getElementById('adminGlobalChart');
    
    // التأكد من وجود العنصر في الصفحة
    if (!ctxGlobal) {
        console.error("عنصر adminGlobalChart غير موجود!");
        return;
    }

    // تحديد اللغة الحالية لجلب الأسماء الصحيحة
    const lang = localStorage.getItem('skyline_lang') || 'en';
    const labels = lang === 'ar' 
        ? ['سليم', 'لفحة متأخرة', 'عفن أوراق', 'تجعيد أصفر'] 
        : ['Healthy', 'Late Blight', 'Leaf Mold', 'Yellow Curl'];

    // 🛑 أهم خطوة: تدمير الرسم القديم إذا كان موجوداً
    if (adminGlobalChart !== null) {
        adminGlobalChart.destroy();
    }

    // إنشاء الرسم الجديد
    adminGlobalChart = new Chart(ctxGlobal.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: [70, 12, 10, 8],
                backgroundColor: ['#10B981', '#F43F5E', '#F59E0B', '#06B6D4'],
                hoverOffset: 15,
                borderWidth: 0,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        padding: 20,
                        font: { 
                            size: 11, 
                            family: lang === 'ar' ? 'Tajawal' : 'Inter' 
                        }
                    }
                }
            }
        }
    });
    console.log("تم رسم الدائرة بنجاح لغة: " + lang);
}
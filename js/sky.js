
// 1. نظام الترجمة الشامل
let currentLang = "en";

function toggleLanguage() {
    const html = document.getElementById("htmlTag");
    currentLang = currentLang === "en" ? "ar" : "en";

    // كل العناصر التي تحتوي على data-en / data-ar
    const elements = document.querySelectorAll("[data-en]");

    elements.forEach(el => {
        // ترجمة النصوص الداخلية
        el.innerText = el.getAttribute(`data-${currentLang}`);

        // ترجمة placeholders إذا وجدت
        if(el.placeholder) {
            el.placeholder = el.getAttribute(`data-${currentLang}`);
        }
    });

    // ترجمة أزرار في نموذج التسجيل لا تحتوي على data-*
    const regLeft = document.querySelector(".register-left");
    if(regLeft){
        const leftH4 = regLeft.querySelector("h4");
        leftH4.innerText = currentLang === "en" ? "JOIN SKYLINE" : "انضم إلى SKYLINE";

        const leftH1 = regLeft.querySelector("h1");
        leftH1.innerHTML = currentLang === "en" 
            ? "Unleash the <span>Sky Power</span><br>Control the Future of <br>Drone Intelligence"
            : "أطلق <span>قوة السماء</span><br>تحكم بمستقبل<br>الذكاء الاصطناعي للدرون";
        
        const leftP = regLeft.querySelector("p");
        leftP.innerText = currentLang === "en" 
            ? "Join the SKYLINE platform and access advanced drone services, AI aerial analytics, fleet control and autonomous missions."
            : "انضم إلى منصة SKYLINE وتمتع بخدمات الدرون المتقدمة، تحليلات جوية بالذكاء الاصطناعي، إدارة الأسطول، والمهام الذاتية.";

        const exploreBtn = regLeft.querySelector(".btn-outline");
        exploreBtn.innerText = currentLang === "en" ? "Explore Drones" : "استكشف الدرونات";

        const launchBtn = regLeft.querySelector(".btn-primary");
        launchBtn.innerText = currentLang === "en" ? "Launch Platform" : "إطلاق المنصة";
    }

    const regRight = document.querySelector(".register-right");
    if(regRight){
        const h2 = regRight.querySelector("h2");
        h2.innerText = currentLang === "en" ? "Create Drone Account." : "إنشاء حساب درون.";

        const inputs = regRight.querySelectorAll("input");
        if(inputs.length >= 5){
            inputs[0].placeholder = currentLang === "en" ? "Drone Username" : "اسم المستخدم للدرون";
            inputs[1].placeholder = currentLang === "en" ? "Pilot Name" : "اسم الطيار";
            inputs[2].placeholder = currentLang === "en" ? "Company / Team" : "الشركة / الفريق";
            inputs[3].placeholder = currentLang === "en" ? "Email Address" : "البريد الإلكتروني";
            inputs[4].placeholder = currentLang === "en" ? "Secure Password" : "كلمة مرور آمنة";
        }

        const select = document.getElementById("serviceSelect");
        if(select){
            select.options[0].textContent = currentLang === "en" ? "Select Service" : "اختر نوع الخدمة";
            select.options[1].textContent = currentLang === "en" ? "Administrator" : "مسؤول";
            select.options[2].textContent = currentLang === "en" ? "Agriculture" : "الزراعة";
            select.options[3].textContent = currentLang === "en" ? "Security Surveillance" : "المراقبة الأمنية";
            select.options[4].textContent = currentLang === "en" ? "Fleet Management" : "إدارة الأسطول";
            select.options[5].textContent = currentLang === "en" ? "Aerial Advertising" : "الإعلانات الجوية";
            select.options[6].textContent = currentLang === "en" ? "Drone Shows" : "عروض الدرون";
        }

        const remember = regRight.querySelector(".remember-box label");
        if(remember){
            remember.childNodes[1].textContent = currentLang === "en" ? "Remember me" : "تذكرني";
        }

        const forgot = regRight.querySelector(".forgot");
        if(forgot) forgot.innerText = currentLang === "en" ? "Forgot password?" : "نسيت كلمة المرور؟";

        const registerBtn = regRight.querySelector(".btn-register-big");
        if(registerBtn) registerBtn.innerText = currentLang === "en" ? "Create Account" : "إنشاء الحساب";

        const loginLink = regRight.querySelector(".login-link span");
        if(loginLink) loginLink.innerText = currentLang === "en" ? "Already a member?" : "هل لديك حساب بالفعل؟";

        const loginBtn = regRight.querySelector(".login-small-btn");
        if(loginBtn) loginBtn.innerText = currentLang === "en" ? "Log In" : "تسجيل الدخول";

        const orDivider = regRight.querySelector(".or-divider span");
        if(orDivider) orDivider.innerText = currentLang === "en" ? "OR" : "أو";

        const googleBtn = regRight.querySelector(".google-btn");
        if(googleBtn) googleBtn.childNodes[2].textContent = currentLang === "en" ? "Continue with Google" : "المتابعة باستخدام Google";
    }

    // Footer
    const footer = document.querySelector(".main-footer");
    if(footer){
        // Brand description
        const brandP = footer.querySelector(".footer-brand p");
        if(brandP) brandP.innerText = currentLang === "en" 
            ? "Empowering the sky with AI." 
            : "تمكين السماء بالذكاء الاصطناعي.";

        // Footer services
        const servicesLis = footer.querySelectorAll(".footer-col:nth-child(2) ul li");
        const servicesText = currentLang === "en" 
            ? ["Smart Agriculture","Security Surveillance","Fleet Management","Aerial Advertising","Drone Shows"]
            : ["الزراعة الذكية","المراقبة الأمنية","إدارة الأسطول","الإعلانات الجوية","عروض الدرون"];
        servicesLis.forEach((li,i) => li.innerText = servicesText[i]);

        // Company
        const companyLis = footer.querySelectorAll(".footer-col:nth-child(3) ul li");
        const companyText = currentLang === "en" 
            ? ["About SKYLINE","Our Fleet","Technology","Join Our Team"]
            : ["حول SKYLINE","أسطولنا","التكنولوجيا","انضم إلى فريقنا"];
        companyLis.forEach((li,i) => li.innerText = companyText[i]);

        // Contact
        const contactP = footer.querySelectorAll(".footer-col:nth-child(4) p");
        if(contactP.length >=3){
            contactP[0].innerText = currentLang === "en" ? "📍 Algeria" : "📍 الجزائر";
            contactP[1].innerText = currentLang === "en" ? "📧 contact@skyline.com" : "📧 contact@skyline.com";
            contactP[2].innerText = currentLang === "en" ? "📞 +213 555 000 000" : "📞 +213 555 000 000";
        }
    }

    // تحديث اتجاه الصفحة والزر
    html.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
    html.setAttribute("lang", currentLang);
    document.querySelector(".langBtn").innerText = currentLang === "en" ? "AR" : "EN";
}

// 2. تأثير الـ 3D Tilt للخدمات
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${y * -20}deg) rotateY(${x * 20}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
});

// 3. التحقق من النموذج
document.getElementById('regForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert(currentLang === "en" ? "Account Created Successfully!" : "تم إنشاء الحساب بنجاح!");
});
/* زر Explore Scroll Animation */

const exploreBtn = document.getElementById("exploreBtn");

exploreBtn.addEventListener("click", () => {

const target = document.getElementById("services");

target.scrollIntoView({

behavior:"smooth",

block:"start"

});

});
/* Drone Fleet Slider */

const drones = document.querySelectorAll(".drone-spec-card");

let droneIndex = 0;

function showNextDrone(){

drones[droneIndex].classList.remove("active");

droneIndex++;

if(droneIndex >= drones.length){
droneIndex = 0;
}

drones[droneIndex].classList.add("active");

}

setInterval(showNextDrone,5000);
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<80;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2,
dx:(Math.random()-0.5)*0.5,
dy:(Math.random()-0.5)*0.5
});
}

function animateParticles(){

ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{
p.x+=p.dx;
p.y+=p.dy;

ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle="#38bdf8";
ctx.fill();
});

requestAnimationFrame(animateParticles);
}

animateParticles();
function handleRegister(){

const service = document.getElementById("serviceSelect").value;

if(!service){

alert("Please select a service first");
return;

}

/* ADMIN */

if(service === "administrator"){

window.location.href = "login.html";

}

/* AGRICULTURE */

else if(service === "agriculture"){

window.location.href = "agriculture/index.html";

}

/* OTHER SERVICES */

else{

window.location.href = "soon.html";

}

}
function handleLogin(){

const service = document.getElementById("serviceSelect");

if(!service || service.value === ""){

// اذا لم يختار الخدمة نذهب لنموذج التسجيل
window.location.href = "#contact";
return;

}

const selected = service.value;

/* ADMIN */

if(selected === "administrator"){

window.location.href = "login.html";

}

/* AGRICULTURE */

else if(selected === "agriculture"){

window.location.href = "home.html";

}

/* باقي الخدمات */

else{

window.location.href = "soon.html";

}

}
// اختر زر Explore Drones
const exploreDronesBtn = document.querySelector(".register-left .btn-outline");

// عند الضغط على الزر، نعمل Scroll إلى قسم Our Fleet
exploreDronesBtn.addEventListener("click", () => {
    const fleetSection = document.getElementById("fleet");
    fleetSection.scrollIntoView({
        behavior: "smooth",  // يجعل الحركة سلسة
        block: "start"       // يبدأ العرض من أعلى القسم
    });
});

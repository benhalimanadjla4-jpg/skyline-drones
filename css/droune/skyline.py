# =================================================
#  SKYLINE LAND — كودك الأصلي + GPS + تشخيص + Supabase
#  كل شيء في ملف واحد
#  تشغيل: python drone_final.py
# =================================================

import airsim
import keyboard
import time
import os
import json
import requests
import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import efficientnet_b4
from PIL import Image
from datetime import datetime

# ══════════════════════════════════════════════
#  إعدادات — غيّري هذه فقط
# ══════════════════════════════════════════════
IMAGE_DIR    = r"C:\Users\Asus\Desktop\droune\images"
MODEL_PATH = r"C:\Users\Asus\Desktop\skyline_model.pth"
SUPABASE_URL = "https://rpbswbyxlmcwlqkkpnhe.supabase.co"   # ← غيّري
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYnN3Ynl4bG1jd2xxa2twbmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NDM4OTYsImV4cCI6MjA5MzAxOTg5Nn0.7gdbzv9TQDvF-vxE--1kVMO438YrTcTANuS_CavXfXA"                      # ← غيّري

GPS_LAT = 34.8500   # إحداثيات مركز حقلك
GPS_LON = 1.3167
GPS_ALT = 800.0

SPEED    = 3
YAW_RATE = 30
# ══════════════════════════════════════════════

os.makedirs(IMAGE_DIR, exist_ok=True)

HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json"
}

DEVICE  = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CLASSES = ['diseased', 'healthy']

# ── تحميل النموذج ─────────────────────────────
def load_model():
    if not os.path.exists(MODEL_PATH):
        print("⚠️  النموذج غير موجود — التشخيص معطّل")
        print(f"   ضعي skyline_model.pth في: {MODEL_PATH}")
        return None
    print("🧠 تحميل النموذج...")
    model = efficientnet_b4(weights=None)
    in_f  = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(in_f, 2)
    )
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE).eval()
    print(f"✅ النموذج جاهز ({DEVICE})")
    return model

TF = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225]),
])

# ── تشخيص صورة ────────────────────────────────
def diagnose(model, img_path):
    if model is None:
        return "unknown", 0.0, "gray"
    img    = Image.open(img_path).convert("RGB")
    tensor = TF(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        probs = torch.softmax(model(tensor), dim=1)[0]
        pred  = probs.argmax().item()
        conf  = round(probs[pred].item() * 100, 1)
    label = CLASSES[pred]
    flag  = "green" if label == "healthy" else "red"
    return label, conf, flag

# ── حساب GPS من موضع Unreal ───────────────────
def calc_gps(pos):
    lat = GPS_LAT + (pos.y_val / 111320.0)
    lon = GPS_LON + (pos.x_val / 111320.0)
    alt = GPS_ALT + abs(pos.z_val)
    return round(lat,7), round(lon,7), round(alt,1)

# ── رفع لـ Supabase ────────────────────────────
def upload(result):
    try:
        url  = f"{SUPABASE_URL}/rest/v1/field_results"
        resp = requests.post(url, headers=HEADERS, json=result, timeout=5)
        if resp.status_code in [200,201]:
            print(f"  ☁️  Supabase ✅")
        else:
            print(f"  ☁️  Supabase ❌ {resp.status_code}")
    except Exception as e:
        print(f"  ☁️  خطأ اتصال: {e}")

# ══════════════════════════════════════════════
#  البرنامج الرئيسي
# ══════════════════════════════════════════════
print("""
╔══════════════════════════════════╗
║   SKYLINE LAND — الدرون الذكي   ║
╠══════════════════════════════════╣
║  5 / 2 / 1 / 3  : تحرك         ║
║  ↑ ↓  : ارتفاع / نزول           ║
║  ← →  : دوران                   ║
║  ENTER: صورة + تشخيص + Supabase ║
║  Q    : خروج                    ║
╚══════════════════════════════════╝
""")

# تحميل النموذج
model = load_model()

# اتصال AirSim
print("🔗 الاتصال بـ AirSim...")
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)
print("✅ متصل!\n")

# عدد الصور الموجودة
img_count  = len([f for f in os.listdir(IMAGE_DIR) if f.endswith(".jpg")])
last_photo = 0

# إقلاع
client.takeoffAsync().join()
time.sleep(2)

while True:
    vx, vy, vz, yaw = 0, 0, 0, 0

    if keyboard.is_pressed('5'):    vx =  SPEED
    if keyboard.is_pressed('2'):    vx = -SPEED
    if keyboard.is_pressed('1'):    vy = -SPEED
    if keyboard.is_pressed('3'):    vy =  SPEED
    if keyboard.is_pressed('up'):   vz = -SPEED
    if keyboard.is_pressed('down'): vz =  SPEED
    if keyboard.is_pressed('left'): yaw = -YAW_RATE
    if keyboard.is_pressed('right'):yaw =  YAW_RATE

    # ── التقاط صورة ──────────────────────────
    if keyboard.is_pressed('enter') and time.time() - last_photo > 0.8:
        last_photo = time.time()

        # موضع الدرون
        state = client.getMultirotorState()
        pos   = state.kinematics_estimated.position
        lat, lon, alt = calc_gps(pos)

        # التقاط الصورة
        responses = client.simGetImages([
            airsim.ImageRequest("0", airsim.ImageType.Scene, False, False)
        ])
        response = responses[0]

        if response.width > 0 and response.height > 0:
            img_name = f"img_{img_count}.jpg"
            img_path = os.path.join(IMAGE_DIR, img_name)

            # حفظ الصورة
            img_rgb = Image.frombytes(
                "RGB",
                (response.width, response.height),
                response.image_data_uint8
            )
            img_rgb = img_rgb.resize((1280, 720), Image.LANCZOS)
            img_rgb.save(img_path, "JPEG", quality=92)

            print(f"\n📸 {img_name}")
            print(f"   📍 GPS: {lat}, {lon} | Alt: {alt}m")

            # تشخيص
            label, conf, flag = diagnose(model, img_path)
            emoji = "🟢" if flag == "green" else "🔴"
            print(f"   {emoji} {label.upper()} | ثقة: {conf}%")

            # بناء النتيجة
            result = {
                "image":      img_name,
                "latitude":   lat,
                "longitude":  lon,
                "altitude":   alt,
                "flag":       flag,
                "diagnosis":  label,
                "confidence": conf,
                "timestamp":  datetime.now().isoformat()
            }

            # حفظ GPS محلياً
            gps_path = img_path.replace(".jpg", "_GPS.json")
            with open(gps_path, "w") as f:
                json.dump(result, f, indent=2, ensure_ascii=False)

            # رفع Supabase
            upload(result)

            img_count += 1

    if keyboard.is_pressed('q'):
        break

    client.moveByVelocityAsync(
        vx, vy, vz, 0.05,
        yaw_mode=airsim.YawMode(is_rate=True, yaw_or_rate=yaw)
    )
    time.sleep(0.05)

# إيقاف
client.hoverAsync().join()
client.armDisarm(False)
client.enableApiControl(False)
print(f"\n✅ انتهى | إجمالي الصور: {img_count} | المجلد: {IMAGE_DIR}")
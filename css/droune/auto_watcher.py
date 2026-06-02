# =================================================
#  SKYLINE LAND — المراقب التلقائي
#  يراقب مجلد الصور ويشخّص كل صورة جديدة تلقائياً
#  ثم يرفع النتيجة لـ Supabase فوراً
#
#  تشغيل: python auto_watcher.py
#  متطلبات: pip install torch torchvision pillow requests watchdog
# =================================================

import os
import json
import time
import requests
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# ── إعدادات — غيّريها ────────────────────────────
WATCH_DIR    = r"C:\Users\Asus\Bureau\droune\images"   # مجلد الصور
MODEL_PATH   = r"C:\Users\Asus\Bureau\skyline_model.pth"  # النموذج
SUPABASE_URL = "https://XXXX.supabase.co"             # ← غيّري
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYnN3Ynl4bG1jd2xxa2twbmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NDM4OTYsImV4cCI6MjA5MzAxOTg5Nn0.7gdbzv9TQDvF-vxE--1kVMO438YrTcTANuS_CavXfXA"                                # ← غيّري
GPS_ORIGIN   = {"lat": 34.8500, "lon": 1.3167, "alt": 800.0}
# ─────────────────────────────────────────────────

DEVICE  = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CLASSES = ['diseased', 'healthy']

HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json"
}

# تحويل الصورة
TF = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],
                         [0.229,0.224,0.225]),
])

# ── تحميل النموذج ─────────────────────────────────
def load_model():
    print("🧠 تحميل النموذج...")
    from torchvision.models import efficientnet_b4, EfficientNet_B4_Weights
    model = efficientnet_b4(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(in_features, 2)
    )
    model.load_state_dict(
        torch.load(MODEL_PATH, map_location=DEVICE)
    )
    model.to(DEVICE).eval()
    print(f"✅ النموذج جاهز على {DEVICE}")
    return model

# ── تشخيص صورة واحدة ─────────────────────────────
def predict(model, img_path):
    img    = Image.open(img_path).convert("RGB")
    tensor = TF(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        probs = torch.softmax(model(tensor), dim=1)[0]
        pred  = probs.argmax().item()
        conf  = probs[pred].item()
    return CLASSES[pred], round(conf * 100, 1)

# ── قراءة GPS من ملف JSON المرفق ─────────────────
def read_gps(img_path):
    gps_path = img_path.replace(".jpg", "_GPS.json")
    if os.path.exists(gps_path):
        with open(gps_path) as f:
            return json.load(f)
    # إذا لم يوجد GPS — قيم افتراضية
    return {
        "latitude":  GPS_ORIGIN["lat"],
        "longitude": GPS_ORIGIN["lon"],
        "altitude_m": GPS_ORIGIN["alt"]
    }

# ── رفع نتيجة لـ Supabase ────────────────────────
def upload_to_supabase(result):
    url  = f"{SUPABASE_URL}/rest/v1/field_results"
    resp = requests.post(url, headers=HEADERS, json=result)
    if resp.status_code in [200, 201]:
        print(f"  ☁️  Supabase ← رُفع بنجاح")
        return True
    else:
        print(f"  ⚠️  فشل الرفع: {resp.text[:80]}")
        return False

# ── معالجة صورة جديدة ────────────────────────────
def process_image(model, img_path):
    img_name = os.path.basename(img_path)
    print(f"\n🔍 صورة جديدة: {img_name}")

    # انتظار اكتمال الحفظ
    time.sleep(0.5)
    if not os.path.exists(img_path):
        return

    try:
        # تشخيص
        label, conf = predict(model, img_path)
        flag  = "green" if label == "healthy" else "red"
        emoji = "🟢" if flag == "green" else "🔴"

        # GPS
        gps = read_gps(img_path)

        result = {
            "image":      img_name,
            "latitude":   gps.get("latitude",   GPS_ORIGIN["lat"]),
            "longitude":  gps.get("longitude",  GPS_ORIGIN["lon"]),
            "altitude":   gps.get("altitude_m", GPS_ORIGIN["alt"]),
            "flag":       flag,
            "diagnosis":  label,
            "confidence": conf,
            "timestamp":  datetime.now().isoformat()
        }

        print(f"  {emoji} {label.upper()} | ثقة: {conf}%")
        print(f"  📍 GPS: {result['latitude']:.5f}, {result['longitude']:.5f}")

        # رفع لـ Supabase
        upload_to_supabase(result)

        # حفظ محلي أيضاً
        local_json = img_path.replace(".jpg", "_result.json")
        with open(local_json, "w") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

    except Exception as e:
        print(f"  ❌ خطأ: {e}")

# ── مراقب المجلد ─────────────────────────────────
class ImageHandler(FileSystemEventHandler):
    def __init__(self, model):
        self.model    = model
        self.processed = set()

    def on_created(self, event):
        if event.is_directory:
            return
        path = event.src_path
        if path.endswith(".jpg") and path not in self.processed:
            self.processed.add(path)
            process_image(self.model, path)

# ── البرنامج الرئيسي ─────────────────────────────
def main():
    print("=" * 50)
    print("  SKYLINE LAND — المراقب التلقائي")
    print("=" * 50)
    print(f"📁 المجلد: {WATCH_DIR}")
    print(f"🌐 Supabase: {SUPABASE_URL}")
    print()

    # تحميل النموذج
    model = load_model()

    # بدء المراقبة
    handler  = ImageHandler(model)
    observer = Observer()
    observer.schedule(handler, WATCH_DIR, recursive=False)
    observer.start()

    print(f"\n👁️  أبدأت المراقبة... (Ctrl+C للإيقاف)")
    print(f"    كل صورة JPG جديدة ستُشخَّص وتُرفع تلقائياً\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n⏹️  توقف المراقب")

    observer.join()

if __name__ == "__main__":
    main()

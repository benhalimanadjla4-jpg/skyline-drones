# =============================================================
#  SKYLINE LAND — المرحلة 2
#  الدرون الذكي: طيران مربع + GPS + صور عالية الجودة
#  تشغيل: python phase2_drone_flight.py
#  متطلبات: pip install airsim opencv-python numpy pillow
# =============================================================

import airsim
import cv2
import numpy as np
import json
import os
import time
from datetime import datetime
from PIL import Image, ImageEnhance

# ─────────────────────────────────────────────
#  إعدادات الطيران — غيّريها حسب حقلك
# ─────────────────────────────────────────────
ALTITUDE      = -12        # ارتفاع الطيران بالمتر (سالب = للأعلى في AirSim)
SPEED         = 3          # سرعة الطيران م/ث (خفيف لصور واضحة)
GRID_SIZE     = 40         # حجم المربع بالمتر
GRID_STEPS    = 4          # عدد صفوف الشبكة
STRIP_WIDTH   = 10         # عرض الشريط بين الصفوف
CAPTURE_EVERY = 2.5        # التقاط صورة كل N ثانية

# إعدادات الصورة
IMG_WIDTH  = 1280
IMG_HEIGHT = 720
IMG_QUALITY = 95           # جودة JPEG (0-100)

# مجلدات الحفظ
BASE_DIR   = "C:/DroneCaptures"
RGB_DIR    = f"{BASE_DIR}/RGB"
DEPTH_DIR  = f"{BASE_DIR}/Depth"
SEG_DIR    = f"{BASE_DIR}/Segmentation"
GPS_DIR    = f"{BASE_DIR}/GPS_Maps"

# إحداثيات GPS الأصل (مركز الحقل — غيّريها لموقعك)
ORIGIN_LAT = 34.8500
ORIGIN_LON = 1.3167
ORIGIN_ALT = 800.0         # ارتفاع الموقع عن سطح البحر بالمتر


# ─────────────────────────────────────────────
#  دوال مساعدة
# ─────────────────────────────────────────────

def create_directories():
    """إنشاء مجلدات الحفظ"""
    for d in [RGB_DIR, DEPTH_DIR, SEG_DIR, GPS_DIR]:
        os.makedirs(d, exist_ok=True)
    print("✅ مجلدات الحفظ جاهزة:", BASE_DIR)


def meters_to_gps(dx, dy, origin_lat, origin_lon):
    """تحويل إزاحة متر → إحداثيات GPS حقيقية"""
    lat = origin_lat + (dy / 111320.0)
    lon = origin_lon + (dx / (111320.0 * np.cos(np.radians(origin_lat))))
    return round(lat, 8), round(lon, 8)


def enhance_image(img_bgr):
    """تحسين جودة الصورة: تباين + حدة + إشباع"""
    img_pil = Image.fromarray(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
    img_pil = ImageEnhance.Contrast(img_pil).enhance(1.2)
    img_pil = ImageEnhance.Sharpness(img_pil).enhance(1.5)
    img_pil = ImageEnhance.Color(img_pil).enhance(1.3)
    return cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)


def capture_all_cameras(client, photo_id, pos, timestamp):
    """التقاط الكاميرات الثلاث ورفع GPS"""
    lat, lon = meters_to_gps(pos.x_val, pos.y_val, ORIGIN_LAT, ORIGIN_LON)
    alt = ORIGIN_ALT + abs(pos.z_val)

    # طلب الصور الثلاث دفعة واحدة
    responses = client.simGetImages([
        airsim.ImageRequest("0", airsim.ImageType.Scene,        False, False),
        airsim.ImageRequest("0", airsim.ImageType.DepthVis,     False, False),
        airsim.ImageRequest("0", airsim.ImageType.Segmentation, False, False),
    ])

    saved_files = []

    for resp, img_type, save_dir in zip(
        responses,
        ["RGB", "Depth", "Segmentation"],
        [RGB_DIR, DEPTH_DIR, SEG_DIR]
    ):
        if resp.width == 0:
            print(f"  ⚠️  كاميرا {img_type} لم ترد")
            continue

        # تحويل البيانات الخام
        img_1d  = np.frombuffer(resp.image_data_uint8, dtype=np.uint8)
        img_bgr = cv2.imdecode(img_1d, cv2.IMREAD_COLOR)

        if img_bgr is None:
            continue

        # تكبير للدقة المطلوبة
        img_bgr = cv2.resize(img_bgr, (IMG_WIDTH, IMG_HEIGHT),
                             interpolation=cv2.INTER_LANCZOS4)

        # تحسين الصورة RGB فقط
        if img_type == "RGB":
            img_bgr = enhance_image(img_bgr)

        # حفظ الصورة بجودة عالية
        filename = f"{img_type}_{photo_id:04d}.jpg"
        filepath = os.path.join(save_dir, filename)
        cv2.imwrite(filepath, img_bgr,
                    [cv2.IMWRITE_JPEG_QUALITY, IMG_QUALITY])
        saved_files.append(filepath)

    # حفظ GPS مع كل مجموعة صور
    gps_data = {
        "photo_id":  photo_id,
        "timestamp": timestamp,
        "latitude":  lat,
        "longitude": lon,
        "altitude":  alt,
        "x_unreal":  round(pos.x_val, 2),
        "y_unreal":  round(pos.y_val, 2),
        "z_unreal":  round(pos.z_val, 2),
        "files": {
            "rgb":  f"RGB/RGB_{photo_id:04d}.jpg",
            "depth": f"Depth/Depth_{photo_id:04d}.jpg",
            "seg":  f"Segmentation/Segmentation_{photo_id:04d}.jpg",
        }
    }

    gps_file = os.path.join(GPS_DIR, f"gps_{photo_id:04d}.json")
    with open(gps_file, "w", encoding="utf-8") as f:
        json.dump(gps_data, f, ensure_ascii=False, indent=2)

    print(f"  📷 صورة {photo_id:04d} | GPS: {lat:.6f}, {lon:.6f} | ارتفاع: {alt:.1f}م")
    return gps_data


def fly_to_waypoint(client, x, y, z, speed=SPEED):
    """الطيران إلى نقطة مع انتظار الوصول"""
    client.moveToPositionAsync(x, y, z, speed).join()
    time.sleep(0.3)  # استقرار خفيف


def generate_grid_waypoints():
    """
    توليد نقاط الشبكة المربعة (Lawnmower pattern)
    يغطي الحقل سطراً سطراً مثل الحصادة
    """
    waypoints = []
    for row in range(GRID_STEPS):
        y = row * STRIP_WIDTH
        if row % 2 == 0:
            # من اليسار لليمين
            waypoints.append((0, y, ALTITUDE))
            waypoints.append((GRID_SIZE, y, ALTITUDE))
        else:
            # من اليمين لليسار
            waypoints.append((GRID_SIZE, y, ALTITUDE))
            waypoints.append((0, y, ALTITUDE))

    return waypoints


# ─────────────────────────────────────────────
#  البرنامج الرئيسي
# ─────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  SKYLINE LAND — الدرون الذكي")
    print("=" * 60)

    create_directories()

    # الاتصال بـ AirSim
    print("\n🔗 الاتصال بـ AirSim...")
    client = airsim.MultirotorClient()
    client.confirmConnection()
    client.enableApiControl(True)
    client.armDisarm(True)

    # إعداد كاميرا عالية الجودة
    client.simSetCameraFov("0", 90)  # زاوية رؤية 90 درجة

    print("✅ الاتصال ناجح — الدرون جاهز\n")

    # الإقلاع
    print("🚁 الإقلاع...")
    client.takeoffAsync().join()
    fly_to_waypoint(client, 0, 0, ALTITUDE)
    print(f"✅ الارتفاع: {abs(ALTITUDE)}م\n")

    # توليد نقاط المسار
    waypoints = generate_grid_waypoints()
    print(f"🗺️  مسار الشبكة: {len(waypoints)} نقطة")
    print(f"    حجم المنطقة: {GRID_SIZE}×{GRID_STEPS * STRIP_WIDTH}م\n")

    # قائمة لحفظ كل بيانات الرحلة
    all_gps = []
    photo_id = 1
    last_capture = 0

    # الطيران على المسار
    for i, (wx, wy, wz) in enumerate(waypoints):
        print(f"📍 نقطة {i+1}/{len(waypoints)}: ({wx:.0f}, {wy:.0f})")

        # الانتقال للنقطة
        client.moveToPositionAsync(wx, wy, wz, SPEED)

        # أثناء الطيران: التقاط صور بانتظام
        while True:
            pos = client.getMultirotorState().kinematics_estimated.position
            dist = np.sqrt((pos.x_val - wx)**2 + (pos.y_val - wy)**2)

            now = time.time()
            if now - last_capture >= CAPTURE_EVERY:
                ts = datetime.now().isoformat()
                gps = capture_all_cameras(client, photo_id, pos, ts)
                all_gps.append(gps)
                photo_id += 1
                last_capture = now

            if dist < 2.0:  # وصلنا للنقطة
                break
            time.sleep(0.2)

        # صورة عند كل نقطة waypoint
        time.sleep(0.5)
        pos = client.getMultirotorState().kinematics_estimated.position
        ts  = datetime.now().isoformat()
        gps = capture_all_cameras(client, photo_id, pos, ts)
        all_gps.append(gps)
        photo_id += 1

    # العودة للقاعدة
    print("\n🏠 العودة للقاعدة...")
    fly_to_waypoint(client, 0, 0, ALTITUDE)
    client.landAsync().join()
    client.armDisarm(False)
    client.enableApiControl(False)

    # حفظ ملف GPS شامل للرحلة كاملة
    flight_summary = {
        "total_photos": len(all_gps),
        "grid_size_m": f"{GRID_SIZE}×{GRID_STEPS * STRIP_WIDTH}",
        "altitude_m": abs(ALTITUDE),
        "origin": {"lat": ORIGIN_LAT, "lon": ORIGIN_LON, "alt": ORIGIN_ALT},
        "captures": all_gps
    }

    summary_file = os.path.join(BASE_DIR, "flight_summary.json")
    with open(summary_file, "w", encoding="utf-8") as f:
        json.dump(flight_summary, f, ensure_ascii=False, indent=2)

    print(f"\n✅ انتهى الطيران!")
    print(f"   📸 إجمالي الصور: {len(all_gps)}")
    print(f"   💾 ملف الرحلة: {summary_file}")
    print(f"   📁 مجلد الصور: {BASE_DIR}")


if __name__ == "__main__":
    main()

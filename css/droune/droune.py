import airsim
import keyboard
import time
import os
from PIL import Image

# اتصال بالدرون
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)

# مجلد الصور
image_dir = r"C:\Users\Asus\Desktop\droune\images"
os.makedirs(image_dir, exist_ok=True)

print("""
Controls:
5 : forward
2 : backward
1 : left
3 : right
UP/DOWN : up / down
LEFT/RIGHT : rotate
ENTER : take photo
Q : quit
""")

speed = 3
yaw_rate = 30
img_count = len(os.listdir(image_dir))  # يبدأ العد من آخر صورة محفوظة

# إقلاع
client.takeoffAsync().join()
time.sleep(2)

while True:
    vx, vy, vz = 0, 0, 0
    yaw = 0

    # تحكم بالأرقام بدل WASD
    if keyboard.is_pressed('5'):
        vx = speed
    if keyboard.is_pressed('2'):
        vx = -speed
    if keyboard.is_pressed('1'):
        vy = -speed
    if keyboard.is_pressed('3'):
        vy = speed

    # الأسهم تبقى كما هي
    if keyboard.is_pressed('up'):
        vz = -speed
    if keyboard.is_pressed('down'):
        vz = speed
    if keyboard.is_pressed('left'):
        yaw = -yaw_rate
    if keyboard.is_pressed('right'):
        yaw = yaw_rate

    # التقاط صورة عند الضغط على Enter
    if keyboard.is_pressed('enter'):
        responses = client.simGetImages([
            airsim.ImageRequest("0", airsim.ImageType.Scene, False, False)
        ])
        response = responses[0]

        if response.width > 0 and response.height > 0:
            img_rgb = Image.frombytes(
                "RGB",
                (response.width, response.height),
                response.image_data_uint8
            )

            image_path = os.path.join(image_dir, f"img_{img_count}.jpg")
            img_rgb.save(image_path)
            print(f"📸 Saved {image_path}")

            img_count += 1
            time.sleep(0.5)  # منع التكرار السريع

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
print("Finished.")

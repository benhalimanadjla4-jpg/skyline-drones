import airsim
import time

# الاتصال بمحاكاة AirSim
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)

# الإقلاع
client.takeoffAsync().join()
time.sleep(2)

# التحليق للأمام 5 متر
client.moveByVelocityAsync(1, 0, 0, 5).join()
time.sleep(2)

# العودة والهبوط
client.landAsync().join()
client.armDisarm(False)
client.enableApiControl(False)

print("نجاح تجربة الطيران!")

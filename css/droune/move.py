import airsim
import time

client = airsim.MultirotorClient()
client.confirmConnection()

client.enableApiControl(True)
client.armDisarm(True)

print("Taking off...")
client.takeoffAsync().join()

time.sleep(2)

print("Going up...")
client.moveByVelocityAsync(0, 0, -2, 3).join()

print("Hovering...")
client.hoverAsync().join()

client.armDisarm(False)
client.enableApiControl(False)

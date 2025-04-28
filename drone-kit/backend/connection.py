from dronekit import connect, VehicleMode, LocationGlobalRelative
from pymavlink import mavutil
import time
import threading
import math
connection_string = "tcp:127.0.0.1:5760"
from flask import Flask,jsonify

app=Flask(__name__)
connection_string = "tcp:127.0.0.1:5760"  # Change if needed
print("Connecting to vehicle...")
vehicle = connect(connection_string, wait_ready=True)
data={"Mode":vehicle.mode.name,"Latitude":vehicle.location.global_frame.lat,"Longitude":vehicle.location.global_frame.lon,"Yaw":vehicle.attitude.yaw,"Altitude":vehicle._location.global_relative_frame.alt,"velocity":vehicle.velocity,"Pitch":vehicle.attitude.pitch,"Roll":vehicle.attitude.roll}
# def monitor_vehicle():
#     """
#     Continuously prints key vehicle data in real-time.
#     Runs in a separate thread.
#     """
#     while True:
#         print("\n--- Real-time Rover Data ---")
#         print(f"Mode: {vehicle.mode.name}")
#         print(f"Latitude: {vehicle.location.global_frame.lat}, Longitude: {vehicle.location.global_frame.lon}")
#         print(f"Yaw (Heading): {vehicle.attitude.yaw:.2f} rad")
#         print(f"Altitude: {vehicle.location.global_relative_frame.alt:.2f} m")
#         print(f"Velocity: X={vehicle.velocity[0]:.2f} m/s, Y={vehicle.velocity[1]:.2f} m/s, Z={vehicle.velocity[2]:.2f} m/s")
#         print(f"IMU: Pitch={vehicle.attitude.pitch:.2f} rad, Roll={vehicle.attitude.roll:.2f} rad")
#         data={"Mode":vehicle.mode.name,"Latitude":vehicle.location.global_frame.lat,"Longitude":vehicle.location.global_frame.lon,"Yaw":vehicle.attitude.yaw,"Altitude":vehicle._location.global_relative_frame.alt,"velocity":vehicle.velocity,"Pitch":vehicle.attitude.pitch,"Roll":vehicle.attitude.roll}
#         time.sleep(1)  # Refresh every second

# Start monitoring in a separate thread
# monitor_thread = threading.Thread(target=monitor_vehicle, daemon=True)
# monitor_thread.start()

def arm_rover():
    """
    Arms the Rover and sets it to 'GUIDED' mode.
    """
    print("Arming Rover...")

    while not vehicle.is_armable:
        print("Waiting for Rover to become armable...")
        time.sleep(1)

    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        print("Waiting for arming...")
        time.sleep(1)

    print("Rover Armed and Ready!")

def stop_rover():
    """
    Stops the Rover by setting velocity to zero.
    """
    print("Stopping Rover...")
    send_velocity(0, 0, 0)  # Stop movement
    vehicle.mode = VehicleMode("HOLD")  # Hold position
    time.sleep(1)

def move_to_waypoint(lat, lon, alt=0):
    """
    Moves the Rover to a GPS waypoint.
    """
    target_location = LocationGlobalRelative(lat, lon, alt)
    print(f"Moving to waypoint: {lat}, {lon}")

    vehicle.simple_goto(target_location, groundspeed=2)  # Move at 2 m/s

    while True:
        current_location = vehicle.location.global_relative_frame
        distance = get_distance_meters(current_location, target_location)
        print(f"Distance to waypoint: {distance:.2f} meters")

        if distance < 1:  # Stop when within 1 meter of the target
            print("Reached waypoint!")
            break
        time.sleep(2)

def send_velocity(velocity_x, velocity_y, velocity_z):
    """
    Sends velocity commands to the Rover.
    """
    msg = vehicle.message_factory.set_position_target_local_ned_encode(
        0, 0, 0, mavutil.mavlink.MAV_FRAME_BODY_NED, 
        0b0000111111000111,  # Control only velocity
        0, 0, 0, velocity_x, velocity_y, velocity_z, 0, 0, 0, 0, 0
    )
    vehicle.send_mavlink(msg)
    vehicle.flush()

def move_by_velocity(forward, right, down):
    """
    Moves the Rover using velocity (m/s).
    """
    send_velocity(forward, right, down)

def move_by_acceleration(accel_x, accel_y, accel_z):
    """
    Moves the Rover using acceleration (m/s²).
    """
    msg = vehicle.message_factory.set_position_target_local_ned_encode(
        0, 0, 0, mavutil.mavlink.MAV_FRAME_BODY_NED, 
        0b0000111110000111,  # Control only acceleration
        0, 0, 0, 0, 0, 0, accel_x, accel_y, accel_z, 0, 0
    )
    vehicle.send_mavlink(msg)
    vehicle.flush()

def get_distance_meters(location1, location2):
    """
    Returns the distance in meters between two global locations.
    """
    lat1, lon1 = location1.lat, location1.lon
    lat2, lon2 = location2.lat, location2.lon
    R = 6371000  # Earth radius in meters

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# ---- MAIN CONTROL ----
arm_rover()
move_by_velocity(1, 0, 0)  # Move forward at 1 m/s
time.sleep(3)  # Move for 3 seconds
stop_rover()

move_to_waypoint(47.397742, 8.545593)  # Example waypoint (Update coordinates)
stop_rover()

move_by_acceleration(0.5, 0, 0)  # Accelerate forward
time.sleep(3)
stop_rover()
@app.route("/data",methods=["GET"])
def get_data():
    return jsonify(data)
if __name__=="__main__":
    app.run(port=5000,debug=True)

from flask import Flask, jsonify, request
from dronekit import connect, VehicleMode
from pymavlink import mavutil
from flask_cors import CORS
import threading
import time

app = Flask(__name__)
CORS(app)  # Enable CORS
vehicle = None  # Initialize as None
current_velocity = {"vx": 0, "vy": 0, "vz": 0}  # Store current velocity

def get_vehicle():
    global vehicle
    if vehicle is None:
        print("Connecting to vehicle...")
        vehicle = connect("tcp:127.0.0.1:5760", wait_ready=True)
    return vehicle

def send_velocity_command():
    """
    Continuously send the last set velocity command to keep the vehicle moving.
    """
    global current_velocity
    vehicle = get_vehicle()

    while True:
        if vehicle and vehicle.armed:
            msg = vehicle.message_factory.set_position_target_local_ned_encode(
                0,  # time_boot_ms
                0, 0,  # target system, target component
                mavutil.mavlink.MAV_FRAME_LOCAL_NED,  # Coordinate frame
                0b0000111111000111,  # Type mask (only velocity enabled)
                0, 0, 0,  # x, y, z positions (not used)
                current_velocity["vx"], current_velocity["vy"], current_velocity["vz"],  # x, y, z velocity
                0, 0, 0,  # x, y, z acceleration (not used)
                0, 0  # yaw, yaw_rate (not used)
            )
            vehicle.send_mavlink(msg)
            vehicle.flush()
        time.sleep(0.5)  # Send command every 0.5 seconds

@app.route('/data', methods=['GET'])
def get_data():
    vehicle = get_vehicle()
    if vehicle:
        data = {
            "Mode": vehicle.mode.name,
            "Latitude": vehicle.location.global_frame.lat,
            "Longitude": vehicle.location.global_frame.lon,
            "Yaw": vehicle.attitude.yaw,
            "Altitude": vehicle.location.global_relative_frame.alt,
            "Velocity": vehicle.velocity,
            "Pitch": vehicle.attitude.pitch,
            "Roll": vehicle.attitude.roll,
            "Speed": vehicle.groundspeed,
            "Heading": vehicle.heading,
            "Armed": vehicle.armed
        }
        return jsonify(data)
    else:
        return jsonify({"error": "Vehicle not connected"}), 500

@app.route('/vehicle/move', methods=['POST'])
def move_vehicle():
    global current_velocity
    vehicle = get_vehicle()
    if vehicle is None:
        return jsonify({"error": "Vehicle not connected"}), 500

    if vehicle.mode.name != "GUIDED":
        vehicle.mode = VehicleMode("GUIDED")

    if not vehicle.armed:
        print("Arming vehicle...")
        vehicle.armed = True

    data = request.json
    acceleration = data.get("acceleration", 5)  # Default acceleration = 5 m/s
    direction = data.get("direction", "forward")

    # Update global velocity based on direction
    if direction == "forward":
        current_velocity = {"vx": acceleration, "vy": 0, "vz": 0}
    elif direction == "backward":
        current_velocity = {"vx": -acceleration, "vy": 0, "vz": 0}
    elif direction == "left":
        current_velocity = {"vx": 0, "vy": -acceleration, "vz": 0}
    elif direction == "right":
        current_velocity = {"vx": 0, "vy": acceleration, "vz": 0}
    elif direction == "up":
        current_velocity = {"vx": 0, "vy": 0, "vz": -acceleration}
    elif direction == "down":
        current_velocity = {"vx": 0, "vy": 0, "vz": acceleration}
    elif direction=="stop":
        current_velocity = {"vx": 0, "vy": 0, "vz": 0}
        return jsonify({"message":"vehicle stopped"})
    else:
        return jsonify({"error": "Invalid direction"}), 400

    return jsonify({"message": f"Moving {direction} with acceleration {acceleration} m/s", "Armed": vehicle.armed})

if __name__ == "__main__":
    # Start the velocity command thread
    velocity_thread = threading.Thread(target=send_velocity_command, daemon=True)
    velocity_thread.start()
    
    app.run(port=5000, debug=True, use_reloader=False)

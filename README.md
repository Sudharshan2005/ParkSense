# 🚗 ParkSense

**ParkSense** is a smart parking system designed to help drivers find available parking spots in real-time using IoT sensors, machine learning, and a user-friendly web/mobile interface. The system aims to reduce traffic congestion and save time by optimizing parking space utilization in urban areas.

---

## 🧠 Features

- 🔍 **Real-Time Parking Availability**
- 📍 **Location-Based Spot Finder**
- 📊 **Dashboard for Admin Analytics**
- 🧠 **ML-Powered Occupancy Predictions**
- 🌐 **Web & Mobile-Friendly Interface**
- 🔒 **Secure Authentication for Admins/Users**

---

## 🏗️ Tech Stack

| Component | Tech Used |
|----------|-----------|
| Frontend | React.js / Tailwind CSS |
| Backend | Node.js / Express.js |
| Database | MongoDB |
| IoT Integration | Raspberry Pi / Arduino / Ultrasonic Sensors |
| ML Model | Python (scikit-learn / TensorFlow) |
| Hosting | Vercel / Render / AWS / Firebase |

---
## Installing Drivers and Essentials on Jetson Nano

To properly set up your Jetson Nano, install drivers and essential development packages.

### Steps:

1. **Flash Jetson Nano**  
   Use the latest JetPack SDK via NVIDIA SDK Manager to flash your Jetson Nano.

2. **Boot and Initial Setup**  
   Power on Jetson Nano and complete the Ubuntu setup wizard.

3. **Update and Upgrade the System**
    ```bash
    sudo apt update
    sudo apt upgrade -y
    ```

4. **Install Basic Tools and Build Essentials**
    ```bash
    sudo apt install -y build-essential cmake git pkg-config
    sudo apt install -y python3-pip python3-dev
    sudo apt install -y libopencv-dev
    sudo apt install -y i2c-tools
    sudo apt install -y nano vim
    ```

5. **Install Additional Python Packages (if needed)**
    ```bash
    pip3 install numpy matplotlib
    ```

6. **Reboot the system**
    ```bash
    sudo reboot
    ```

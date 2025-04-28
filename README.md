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


# Jetson Nano Setup - OpenCV with CUDA Support

### Contribution by Vaishnavi

This README outlines the steps I followed to install OpenCV with CUDA support on the Jetson Nano.

---

## ✅ Steps Followed

1. **System Update**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade

sudo apt-get purge libopencv*

sudo apt-get install cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install python3-dev python3-numpy


git clone https://github.com/opencv/opencv.git
git clone https://github.com/opencv/opencv_contrib.git

cd opencv
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE \
      -D CMAKE_INSTALL_PREFIX=/usr/local \
      -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules \
      -D WITH_CUDA=ON \
      -D ENABLE_NEON=ON \
      -D WITH_GSTREAMER=ON \
      -D WITH_LIBV4L=ON \
      -D BUILD_opencv_python3=ON \
      -D BUILD_opencv_python2=OFF \
      -D BUILD_EXAMPLES=ON ..
make -j4  # or use -j2 if memory is low
sudo make install

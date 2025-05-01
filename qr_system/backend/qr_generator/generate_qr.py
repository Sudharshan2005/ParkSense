import qrcode
import os

def generate_qr(car_number, base_url="https://parksense.com/parking/", output_dir="qr_generator/qr_images"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    qr_data = f"{base_url}{car_number}"
    img = qrcode.make(qr_data)
    filename = f"{car_number}.png"
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    return filepath, qr_data

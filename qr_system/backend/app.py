from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from qr_generator.generate_qr import generate_qr

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    car_number = data.get("car_number")
    if not car_number:
        return jsonify({"error": "car_number is required"}), 400

    filepath, qr_url = generate_qr(car_number)
    return jsonify({
        "message": "QR code generated",
        "image_path": filepath,
        "url": qr_url
    })

@app.route('/get-qr/<car_number>')
def get_qr(car_number):
    filepath = f"../qr_generator/qr_images/{car_number}.png"
    if os.path.exists(filepath):
        return send_file(filepath, mimetype='image/png')
    return "QR not found", 404

if __name__ == "__main__":
    app.run(debug=True)

"""
Servidor Python para procesar QR codes
Recibe imágenes del ESP32-CAM y devuelve el código QR detectado

Requisitos:
pip install flask opencv-python pyzbar pillow numpy
"""

from flask import Flask, request, jsonify
from PIL import Image
import cv2
import numpy as np
from pyzbar.pyzbar import decode
import io

app = Flask(__name__)

ip_host = '192.168.0.10' # Ip del servidor donde corre este script
port_host = 5000 # Puerto del servidor donde corre este script

@app.route('/scan-qr', methods=['POST'])
def scan_qr():
    try:
        # Leer imagen del ESP32-CAM
        img_bytes = request.data
        
        # Convertir a numpy array
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({"error": "Invalid image"}), 400
        
        # Decodificar QR
        decoded_objects = decode(img)
        
        if decoded_objects:
            qr_data = decoded_objects[0].data.decode('utf-8')
            print(f"✓ QR detectado: {qr_data}")
            return jsonify({"qr_data": qr_data}), 200
        else:
            return jsonify({"qr_data": ""}), 200
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    print("=== Servidor QR Scanner ===")
    print("Esperando imágenes del ESP32-CAM...")
    print(f"URL: http://{ip_host}:{port_host}/scan-qr")
    app.run(host=ip_host, port=port_host, debug=True)
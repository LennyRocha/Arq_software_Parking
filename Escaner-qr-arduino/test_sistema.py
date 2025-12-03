"""
Script de prueba para verificar el sistema QR Scanner
Genera códigos QR de prueba y simula el ESP32-CAM
"""

import qrcode
import requests
import io
from PIL import Image

def generar_qr(data, filename):
    """Genera un código QR y lo guarda"""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    print(f"✓ QR generado: {filename} -> {data}")
    return img

def test_servidor_python(image_path):
    """Prueba el servidor Python enviando una imagen"""
    print(f"\n=== Probando servidor Python ===")
    
    try:
        with open(image_path, 'rb') as f:
            img_data = f.read()
        
        response = requests.post(
            'http://192.168.0.10:5000/scan-qr',
            data=img_data,
            headers={'Content-Type': 'image/jpeg'},
            timeout=5
        )
        
        if response.status_code == 200:
            result = response.json()
            qr_data = result.get('qr_data', '')
            if qr_data:
                print(f"✓ QR detectado: {qr_data}")
                return qr_data
            else:
                print("✗ No se detectó QR en la imagen")
        else:
            print(f"✗ Error: {response.status_code}")
        
    except requests.exceptions.ConnectionError:
        print("✗ No se puede conectar al servidor Python")
        print("  Asegúrate de que python_qr_server.py está ejecutándose")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    return None

def test_api_entrada(codigo_qr, vehiculo_id):
    """Prueba el endpoint de entrada"""
    print(f"\n=== Probando API Entrada ===")
    
    url = "http://192.168.0.10:8080/api/entrada-salida/pensionado"
    payload = {
        "uuidCodigoQR": codigo_qr,
        "vehiculo": {
            "id": vehiculo_id
        }
    }
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        print(f"POST {url}")
        print(f"Body: {payload}")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
        if 200 <= response.status_code < 300:
            print("✓ Entrada registrada correctamente")
            return True
        else:
            print("✗ Error al registrar entrada")
            
    except requests.exceptions.ConnectionError:
        print("✗ No se puede conectar al API")
        print("  Verifica que el servidor esté corriendo en http://192.168.0.10:8080")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    return False

def test_api_salida(folio):
    """Prueba el endpoint de salida"""
    print(f"\n=== Probando API Salida ===")
    
    url = f"http://192.168.0.10:8080/api/entrada-salida/pensionado/salida/{folio}"
    
    try:
        response = requests.post(url, timeout=5)
        print(f"POST {url}")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
        if 200 <= response.status_code < 300:
            print("✓ Salida registrada correctamente")
            return True
        else:
            print("✗ Error al registrar salida")
            
    except requests.exceptions.ConnectionError:
        print("✗ No se puede conectar al API")
        print("  Verifica que el servidor esté corriendo en http://192.168.0.10:8080")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    return False

def main():
    print("=" * 50)
    print("PRUEBAS DEL SISTEMA QR SCANNER")
    print("=" * 50)
    
    # 1. Generar códigos QR de prueba
    print("\n1️⃣ Generando códigos QR de prueba...")
    qr_entrada = "ABC123DEF456|42"
    qr_salida = "XYZ789GHI012"
    
    generar_qr(qr_entrada, "test_qr_entrada.png")
    generar_qr(qr_salida, "test_qr_salida.png")
    
    # Convertir PNG a JPEG (como lo hace ESP32-CAM)
    for png_file, jpg_file in [("test_qr_entrada.png", "test_qr_entrada.jpg"),
                                ("test_qr_salida.png", "test_qr_salida.jpg")]:
        img = Image.open(png_file)
        img.convert('RGB').save(jpg_file, 'JPEG')
    
    print("\n2️⃣ Probando detección de QR (Servidor Python)...")
    
    # Probar QR de entrada
    print("\n--- QR de Entrada ---")
    detected = test_servidor_python("test_qr_entrada.jpg")
    
    # Probar QR de salida
    print("\n--- QR de Salida ---")
    detected_salida = test_servidor_python("test_qr_salida.jpg")
    
    # 3. Probar APIs (solo si detectó QR)
    if detected:
        print("\n3️⃣ Probando registro en API...")
        
        # Parsear entrada
        if '|' in detected:
            codigo, vehiculo_id = detected.split('|')
            test_api_entrada(codigo, int(vehiculo_id))
        else:
            test_api_salida(detected)
    
    if detected_salida and '|' not in detected_salida:
        test_api_salida(detected_salida)
    
    print("\n" + "=" * 50)
    print("RESUMEN DE PRUEBAS")
    print("=" * 50)
    print("✓ Servidor Python: Funcionando" if detected else "✗ Servidor Python: Error")
    print("✓ Detección QR: OK" if detected else "✗ Detección QR: Fallo")
    print("\n📋 Archivos generados:")
    print("  - test_qr_entrada.png / .jpg")
    print("  - test_qr_salida.png / .jpg")
    print("\n💡 Usa estos QR para probar con el ESP32-CAM")

if __name__ == '__main__':
    main()

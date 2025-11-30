# 📖 Guía de Instalación Completa

## 🎯 Requisitos Previos

- ✅ Windows 10/11
- ✅ Python 3.8 o superior
- ✅ Arduino IDE 2.x
- ✅ ESP32-CAM con programador
- ✅ LCD 16x2 I2C
- ✅ Cable USB y cables jumper

---

## 1️⃣ Instalación de Software

### Python y Dependencias

```bash
# Verificar Python
python --version

# Instalar librerías
pip install flask opencv-python pyzbar pillow numpy
```

### Arduino IDE

1. **Descargar:** https://www.arduino.cc/en/software
2. **Instalar soporte ESP32:**
   - `File` → `Preferences`
   - En "Additional Board Manager URLs":
     ```
     https://dl.espressif.com/dl/package_esp32_index.json
     ```
   - `Tools` → `Board` → `Boards Manager`
   - Buscar "esp32" → Instalar

3. **Instalar librerías:**
   - `Sketch` → `Include Library` → `Manage Libraries`
   - Buscar e instalar:
     - **ArduinoJson** (v6.x)
     - **LiquidCrystal I2C**

---

## 2️⃣ Configuración de Red

### Obtener IP de tu PC

```powershell
ipconfig
```

Anota la `Dirección IPv4` (ej: 192.168.0.10)

### Configurar Firewall

**Abrir PowerShell como Administrador:**

```powershell
netsh advfirewall firewall add rule name="Python QR Server" dir=in action=allow protocol=TCP localport=5000
```

---

## 3️⃣ Configurar el Código

### Editar `ESP32-CAM_QR_Scanner.ino`

Abre: `ESP32-CAM_QR_Scanner/ESP32-CAM_QR_Scanner.ino`

**Modificar líneas 19-22:**

```cpp
const char* WIFI_SSID = "TuWiFi";                    // ← Tu red WiFi
const char* WIFI_PASSWORD = "TuPassword";             // ← Tu contraseña
const char* API_BASE_URL = "http://192.168.x.x:8080"; // ← IP del API Spring Boot
const char* PYTHON_SERVER = "http://192.168.x.x:5000"; // ← IP de tu PC
```

**Ajustar LCD si es necesario (línea 44):**

```cpp
#define LCD_ADDRESS 0x27  // Cambiar a 0x3F si el LCD no funciona
```

---

## 4️⃣ Conexiones Hardware

### LCD I2C → ESP32-CAM

| LCD | ESP32-CAM |
|-----|-----------|
| SDA | GPIO 14   |
| SCL | GPIO 15   |
| VCC | 5V        |
| GND | GND       |

### ESP32-CAM

- **Alimentación:** 5V/2A mínimo (usar fuente externa, no USB)
- **Programador:** ESP32-CAM-MB o FTDI USB-Serial

---

## 5️⃣ Cargar el Código

### Conectar ESP32-CAM

**Con ESP32-CAM-MB:**
1. Insertar ESP32-CAM en el módulo
2. Conectar USB
3. Listo para programar

**Con FTDI:**
1. Conectar cables según esquema
2. Conectar GPIO0 a GND (con jumper)
3. Presionar RESET
4. Remover jumper después de cargar

### En Arduino IDE

1. **Seleccionar placa:**
   - `Tools` → `Board` → `ESP32 Arduino` → **"AI Thinker ESP32-CAM"**

2. **Configurar puerto:**
   - `Tools` → `Port` → Seleccionar COM correspondiente

3. **Ajustar velocidad:**
   - `Tools` → `Upload Speed` → **115200**

4. **Cargar código:**
   - Click en **Upload** (→)
   - Esperar: "Hard resetting via RTS pin..."

5. **Reiniciar:**
   - Presionar botón **RESET** en ESP32-CAM

---

## 6️⃣ Ejecutar el Sistema

### Terminal 1: Servidor Python

```bash
cd Escaner-qr-arduino
python python_qr_server.py
```

**Debe mostrar:**
```
=== Servidor QR Scanner ===
URL: http://192.168.x.x:5000/scan-qr
* Running on http://192.168.x.x:5000
```

### Monitor Serial: ESP32-CAM

1. **Abrir:** `Tools` → `Serial Monitor`
2. **Configurar:** 115200 baud
3. **Presionar RESET** en ESP32-CAM

**Debe mostrar:**
```
=== ESP32-CAM QR Scanner ===
WiFi OK: 192.168.x.x
Camera OK
Sistema listo

⏱️ Escaneando... (cada 0.5s)
📸 Capturando imagen... 
  📡 Respuesta HTTP: 200
○ No QR
```

✅ **Si ves `HTTP: 200`** → ¡Todo funciona!

---

## 7️⃣ Probar con QR

### Generar QR de Prueba

```bash
python test_sistema.py
```

Imprime los archivos generados:
- `test_qr_entrada.png`
- `test_qr_salida.png`

### Escanear

1. Acerca el QR a la cámara (15-30cm)
2. **Monitor Serial mostrará:**
   ```
   ✅ QR: ABC123DEF456|42
   ENTRADA: ABC123DEF456 (ID:42)
   Entrada -> 200
   ```
3. **LCD mostrará:** "Entrada OK"

---

## ✅ Checklist de Verificación

- [ ] Python instalado con todas las dependencias
- [ ] Arduino IDE con soporte ESP32
- [ ] Librerías ArduinoJson y LiquidCrystal_I2C instaladas
- [ ] Firewall configurado (puerto 5000 abierto)
- [ ] Código configurado con WiFi y IPs correctas
- [ ] LCD conectado correctamente
- [ ] ESP32-CAM alimentado con 5V/2A
- [ ] Servidor Python ejecutándose
- [ ] Monitor Serial muestra "HTTP: 200"
- [ ] QR detectados correctamente

---

## 🆘 Problemas Comunes

### "Connection Refused"
→ Ver `SOLUCION_FIREWALL.md`

### LCD no muestra nada
→ Cambiar `LCD_ADDRESS` a `0x3F`

### No detecta QR
→ Mejorar iluminación, ajustar distancia

### Camera Error
→ Verificar ribbon cable, aumentar amperaje

**Para más detalles:** Ver `COMO_PROBAR.md` y `README.md`

# 🚗 ESP32-CAM QR Scanner - Sistema de Estacionamiento

Sistema de control de acceso para estacionamiento usando **ESP32-CAM** con detección de códigos QR en tiempo real.

## 📐 Arquitectura del Sistema

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  ESP32-CAM  │────────▶│ Servidor QR  │────────▶│  API Spring │
│  (Cámara)   │  WiFi   │   (Python)   │  HTTP   │    Boot     │
└─────────────┘         └──────────────┘         └─────────────┘
      │
      ▼
┌─────────────┐
│  LCD 16x2   │
│  (Display)  │
└─────────────┘
```

**Flujo:**
1. ESP32-CAM captura imagen cada 0.5s
2. Envía JPEG al servidor Python vía HTTP
3. Python detecta QR con OpenCV + pyzbar
4. ESP32-CAM registra entrada/salida en API
5. LCD muestra confirmación

---

## 📦 Hardware Requerido

| Componente | Especificación |
|------------|----------------|
| **Microcontrolador** | ESP32-CAM AI-Thinker |
| **Cámara** | OV2640 (incluida) |
| **Display** | LCD 16x2 I2C (0x27 o 0x3F) |
| **Programador** | ESP32-CAM-MB o FTDI USB |
| **Alimentación** | 5V/2A mínimo |

### 🔌 Conexiones

**LCD I2C:**
```
LCD          ESP32-CAM
────────────────────────
SDA    →     GPIO 14
SCL    →     GPIO 15
VCC    →     5V
GND    →     GND
```

**ESP32-CAM:** Configuración AI-Thinker (pines predefinidos en código)

---

## 💻 Software Requerido

### Arduino IDE (ESP32-CAM)

**Librerías necesarias:**
- ✅ **ESP32** (Board support)
- ✅ **ArduinoJson** (v6.x)
- ✅ **LiquidCrystal_I2C**
- ✅ **esp_camera** (incluida con ESP32)
- ✅ **WiFi, HTTPClient** (incluidas)

**Instalación rápida:**
```
1. Tools → Board → Boards Manager → "esp32" → Install
2. Sketch → Include Library → Manage Libraries
3. Buscar e instalar: "ArduinoJson", "LiquidCrystal I2C"
```

### Servidor Python (QR Processor)

**Dependencias:**
```bash
pip install flask opencv-python pyzbar pillow numpy
```

---

## ⚙️ Configuración

### 1️⃣ Configurar WiFi y Servidor

Edita `ESP32-CAM_QR_Scanner/ESP32-CAM_QR_Scanner.ino`:

```cpp
const char* WIFI_SSID = "TuWiFi";
const char* WIFI_PASSWORD = "TuPassword";
const char* API_BASE_URL = "http://192.168.x.x:8080";  // API Spring Boot
const char* PYTHON_SERVER = "http://192.168.x.x:5000"; // Servidor Python
```

**Obtener IP de tu PC:**
```powershell
ipconfig
```
Busca: `Dirección IPv4`

### 2️⃣ Configurar Firewall (Windows)

**Permitir conexiones en puerto 5000:**

```powershell
# Ejecutar como Administrador
netsh advfirewall firewall add rule name="Python QR Server" dir=in action=allow protocol=TCP localport=5000
```

### 3️⃣ Ajustar LCD (si es necesario)

Si el LCD no funciona, cambia la dirección I2C:

```cpp
#define LCD_ADDRESS 0x27  // Probar también: 0x3F
```

---

## 🚀 Instalación y Uso

### Paso 1: Iniciar Servidor Python

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

### Paso 2: Cargar Código al ESP32-CAM

1. **Conectar programador** (ESP32-CAM-MB o FTDI)
2. **Arduino IDE:**
   - `Tools` → `Board` → **"AI Thinker ESP32-CAM"**
   - `Tools` → `Port` → Seleccionar puerto COM
   - `Tools` → `Upload Speed` → **115200**
3. **Upload** (→)
4. **Presionar RESET** en ESP32-CAM

### Paso 3: Verificar Funcionamiento

**Monitor Serial (115200 baud):**
```
=== ESP32-CAM QR Scanner ===
WiFi OK: 192.168.x.x
Camera OK
Sistema listo

⏱️ Escaneando... (cada 0.5s)
📸 Capturando imagen... 📦 Imagen: 9420 bytes
  🌐 Enviando a: http://192.168.x.x:5000/scan-qr
  📡 Respuesta HTTP: 200
○ No QR
```

✅ **Si ves `HTTP: 200`** → Todo funciona correctamente

❌ **Si ves `HTTP: -1` o `connection refused`** → Revisar `SOLUCION_FIREWALL.md`

---

## 📱 Formato de Códigos QR

### Entrada (con ID de vehículo)
```
Formato: codigoQR|idVehiculo
Ejemplo: ABC123DEF456|42

POST /api/entrada-salida/pensionado
Body: {
  "uuidCodigoQR": "ABC123DEF456",
  "vehiculo": {"id": 42}
}
```

### Salida (solo folio)
```
Formato: folioTicket
Ejemplo: XYZ789GHI012

POST /api/entrada-salida/pensionado/salida/XYZ789GHI012
```

### Mensajes en LCD

| Evento | LCD Línea 1 | LCD Línea 2 |
|--------|-------------|-------------|
| Inicio | `Escanee QR...` | (vacío) |
| Procesando | `Procesando...` | (vacío) |
| ✅ Entrada OK | `Entrada OK` | (vacío) |
| ✅ Salida OK | `Salida OK` | (vacío) |
| ❌ Error | `Error Entrada/Salida` | (vacío) |

---

## 🧪 Pruebas

### Generar QR de Prueba

```bash
python test_sistema.py
```

Esto genera:
- `test_qr_entrada.png` → QR de entrada
- `test_qr_salida.png` → QR de salida

Imprime estos QR y pruébalos con la cámara.

### Verificar Servidor

```bash
curl http://192.168.x.x:5000/health
```

**Respuesta esperada:**
```json
{"status":"ok"}
```

---

## 🛠️ Troubleshooting

### ❌ Connection Refused (HTTP: -1)

**Causa:** Firewall bloqueando puerto 5000

**Solución:**
```powershell
# Como Administrador
netsh advfirewall firewall add rule name="Python QR Server" dir=in action=allow protocol=TCP localport=5000
```

Ver: `SOLUCION_FIREWALL.md`

### ❌ Camera Error

**Causas:**
- Módulo de cámara mal conectado
- Alimentación insuficiente (< 2A)
- Modelo incorrecto en Arduino IDE

**Solución:**
1. Verificar conexión del ribbon cable
2. Usar fuente 5V/2A o superior
3. Seleccionar "AI Thinker ESP32-CAM" en Tools → Board

### ❌ LCD no muestra nada

**Solución:**
1. Probar dirección I2C: `0x27` o `0x3F`
2. Ajustar potenciómetro de contraste
3. Verificar conexiones SDA/SCL

### ❌ No detecta QR

**Mejoras:**
- 💡 Aumentar iluminación
- 📏 Distancia óptima: 15-30cm
- 🖨️ Imprimir QR más grande
- 🔳 Mejor contraste (fondo blanco)

---

## 📁 Estructura del Proyecto

```
Escaner-qr-arduino/
├── ESP32-CAM_QR_Scanner/
│   └── ESP32-CAM_QR_Scanner.ino    ← Código Arduino
├── python_qr_server.py              ← Servidor QR (Python)
├── test_sistema.py                  ← Generador de QR de prueba
├── README.md                        ← Este archivo
├── COMO_PROBAR.md                   ← Guía de pruebas detallada
├── INSTRUCCIONES.md                 ← Instalación paso a paso
└── SOLUCION_FIREWALL.md             ← Solución a problemas de red
```

---

## ⚡ Características

- ✅ Escaneo en tiempo real (2 FPS)
- ✅ Detección automática entrada/salida
- ✅ Procesamiento QR con OpenCV (alta precisión)
- ✅ Cooldown de 3s para evitar duplicados
- ✅ Reconexión automática WiFi
- ✅ Debug detallado en Serial Monitor
- ✅ Pantalla LCD con feedback visual

---

## 📄 Licencia

Proyecto de código abierto para uso educativo.

---

## 👨‍💻 Soporte

Para más detalles, consulta:
- 📖 **COMO_PROBAR.md** - Guía de pruebas completa
- 🔧 **SOLUCION_FIREWALL.md** - Problemas de conexión
- 📚 **INSTRUCCIONES.md** - Setup detallado

---

**🚀 ¡Sistema listo para usar!**

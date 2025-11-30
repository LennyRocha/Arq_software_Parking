# 🧪 Cómo Probar el Sistema Paso a Paso

## ✅ Checklist de Verificación

### 1️⃣ Probar el Servidor Python

**En una terminal:**
```bash
python python_qr_server.py
```

**Debe mostrar:**
```
=== Servidor QR Scanner ===
Esperando imágenes del ESP32-CAM...
URL: http://192.168.0.10:5000/scan-qr
 * Running on http://192.168.0.10:5000
```

✅ Si ves esto, el servidor Python funciona

---

### 2️⃣ Probar Detección de QR

**En OTRA terminal:**
```bash
pip install qrcode[pil]
python test_sistema.py
```

**Esto va a:**
1. ✅ Generar códigos QR de prueba
2. ✅ Enviarlos al servidor Python
3. ✅ Verificar que se detectan correctamente
4. ✅ Probar los endpoints del API (si está disponible)

**Archivos generados:**
- `test_qr_entrada.png` - Código QR de entrada
- `test_qr_salida.png` - Código QR de salida

Puedes imprimir estos QR y usarlos para probar con el ESP32-CAM.

---

### 3️⃣ Verificar el ESP32-CAM (Sin Cargar Código)

**Verifica que tienes las librerías en Arduino IDE:**

1. Abre Arduino IDE
2. `Sketch` → `Include Library` → `Manage Libraries`
3. Busca e instala:
   - ✅ **ArduinoJson** (por Benoit Blanchon)
   - ✅ **LiquidCrystal I2C** (por Frank de Brabander)

**Verifica soporte ESP32:**
1. `Tools` → `Board` → Debería aparecer **"AI Thinker ESP32-CAM"**
2. Si no aparece:
   - `File` → `Preferences`
   - En "Additional Board Manager URLs" agrega:
     ```
     https://dl.espressif.com/dl/package_esp32_index.json
     ```
   - `Tools` → `Board` → `Boards Manager`
   - Busca "ESP32" e instala

---

### 4️⃣ Configurar y Cargar al ESP32-CAM

**Edita el archivo `.ino`:**

```cpp
// Líneas 18-21, configura estos valores:
const char* WIFI_SSID = "TuWiFi";          // ← Tu red WiFi
const char* WIFI_PASSWORD = "TuPassword";   // ← Tu contraseña
const char* API_BASE_URL = "http://192.168.0.10:8080";      // ← Tu API
const char* PYTHON_SERVER = "http://192.168.0.10:5000";     // ← IP de tu PC
```

**Para encontrar la IP de tu PC:**
```powershell
ipconfig
```
Busca: `IPv4 Address`

**Conectar ESP32-CAM:**
1. Conecta el programador FTDI o ESP32-CAM-MB
2. Mantén presionado el botón **IO0**
3. Presiona **RESET**
4. Suelta **IO0**

**Cargar el código:**
1. `Tools` → `Board` → **"AI Thinker ESP32-CAM"**
2. `Tools` → `Port` → Selecciona el puerto COM
3. `Tools` → `Upload Speed` → **115200**
4. Click en **Upload** (→)

---

### 5️⃣ Monitorear el ESP32-CAM

**Abre Serial Monitor:**
1. `Tools` → `Serial Monitor`
2. Configura: **115200 baud**

**Debe mostrar:**
```
=== ESP32-CAM QR Scanner ===
LCD inicializado
Conectando a WiFi........
WiFi OK: 192.168.0.X
Camera OK
Sistema listo
```

---

### 6️⃣ Probar Escaneo de QR

1. **Imprime los QR** generados por `test_sistema.py`
2. **Acerca el QR** a la cámara (15-30cm)
3. **Observa:**
   - **Serial Monitor:** Debe mostrar "QR: ABC123DEF456|42"
   - **LCD:** Debe mostrar "Procesando..." luego "Entrada OK"

**Códigos de prueba:**
- **Entrada:** `ABC123DEF456|42` (imprime `test_qr_entrada.png`)
- **Salida:** `XYZ789GHI012` (imprime `test_qr_salida.png`)

---

## 🔍 Diagnóstico de Problemas

### ❌ Servidor Python no inicia

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solución:**
```bash
pip install flask opencv-python pyzbar pillow numpy
```

---

### ❌ ESP32-CAM no conecta al WiFi

**Serial Monitor muestra:** `Error WiFi!`

**Solución:**
1. Verifica SSID y contraseña
2. Asegúrate de usar WiFi 2.4GHz (no 5GHz)
3. Acerca el ESP32 al router

---

### ❌ No detecta códigos QR

**Solución:**
1. Mejora la **iluminación**
2. Ajusta **distancia** (15-30cm)
3. Usa un **QR más grande** (imprímelo más grande)
4. Verifica que el servidor Python esté corriendo

---

### ❌ Error de compilación en Arduino

**Error:** `esp_camera.h: No such file`

**Solución:**
1. Verifica que seleccionaste la placa **AI Thinker ESP32-CAM**
2. Reinstala el soporte de ESP32:
   - `Tools` → `Board` → `Boards Manager`
   - Desinstala y reinstala "esp32"

---

## 📊 Flujo de Prueba Completo

```
1. python_qr_server.py (Terminal 1)
   ↓
2. python test_sistema.py (Terminal 2)
   ↓ (genera test_qr_entrada.png)
3. Imprime el QR
   ↓
4. Carga código al ESP32-CAM
   ↓
5. Monitor Serial (115200)
   ↓
6. Acerca QR a la cámara
   ↓
7. Verifica:
   - Terminal 1: "✓ QR detectado: ABC123DEF456|42"
   - Monitor Serial: "QR: ABC123DEF456|42"
   - LCD: "Entrada OK"
```

---

## 🎯 Resultado Esperado

### En el Servidor Python:
```
✓ QR detectado: ABC123DEF456|42
192.168.0.X - - [30/Nov/2025 10:30:00] "POST /scan-qr HTTP/1.1" 200 -
```

### En el Monitor Serial:
```
=== QR: ABC123DEF456|42 ===
ENTRADA: ABC123DEF456 (ID:42)
Entrada -> 200: {"uuidCodigoQR":"ABC123DEF456","vehiculo":{"id":42}}
```

### En el LCD:
```
Línea 1: Entrada OK
Línea 2: (vacía)
```

---

## 💡 Tips

- 🖨️ **Imprime los QR en papel blanco** para mejor contraste
- 💡 **Buena iluminación** es clave
- 📏 **Distancia óptima:** 15-30cm
- 🔄 **Si no detecta:** mueve el QR lentamente
- 📱 **También funciona** con QR en pantalla de celular

---

## ✅ Sistema Funcionando Correctamente

Si ves esto en cada componente, **todo está bien**:

| Componente | Indicador de Éxito |
|------------|-------------------|
| 🐍 Servidor Python | `Running on http://...` |
| 🧪 Test Script | `✓ QR detectado: ...` |
| 📷 ESP32-CAM | `WiFi OK`, `Camera OK` |
| 📺 LCD | `Escanee QR...` |
| 🔍 Detección | `QR: ABC123...` en Serial |
| ✅ Registro | `Entrada OK` / `Salida OK` |

¡Ahora estás listo para usar el sistema! 🚀

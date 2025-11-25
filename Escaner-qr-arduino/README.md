# ESP32-CAM QR Scanner - Sistema de Estacionamiento

Este proyecto implementa un escáner de códigos QR en tiempo real para un sistema de control de acceso a estacionamiento usando ESP32-CAM con cámara OV2640.

## 📋 Hardware Requerido

- **ESP32-CAM** con módulo de cámara **OV2640**
- **Pantalla LCD 16x2 ARD-380** (comunicación I2C)
- **Programador FTDI** o ESP32-CAM-MB (para cargar el código)
- Fuente de alimentación 5V

## 🔌 Conexiones

### LCD I2C (16x2)
- **SDA** → GPIO 14 (o GPIO que uses para SDA)
- **SCL** → GPIO 15 (o GPIO que uses para SCL)
- **VCC** → 5V
- **GND** → GND

**Nota:** Los pines I2C por defecto del ESP32-CAM pueden variar. Verifica tu modelo específico.

### ESP32-CAM
La configuración de pines de la cámara ya está definida en el código para el modelo AI-THINKER.

## 📚 Librerías Necesarias

Instala las siguientes librerías desde el **Arduino Library Manager**:

1. **ESP32** (Soporte de placa)
   - En Arduino IDE: `Archivo` → `Preferencias` → `Gestor de URLs de placas adicionales`
   - Agregar: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Luego: `Herramientas` → `Placa` → `Gestor de placas` → Buscar "ESP32" e instalar

2. **ArduinoJson** (por Benoit Blanchon)
   ```
   Versión recomendada: 6.x o superior
   ```

3. **LiquidCrystal_I2C** (por Frank de Brabander)
   ```
   Para controlar pantallas LCD con módulo I2C
   ```

4. **quirc** (Librería de decodificación QR)
   - Esta librería necesita ser instalada manualmente
   - Descarga desde: https://github.com/dlbeer/quirc
   - O busca una implementación compatible con ESP32

### Instalación de quirc para ESP32

Puedes usar la librería **ESP32QRCodeReader** que incluye quirc:
```
Buscar en Library Manager: "ESP32 QRCode Reader" por Alastair D'Silva
```

O clonar directamente:
```bash
cd ~/Arduino/libraries/
git clone https://github.com/alvarowolfx/ESP32QRCodeReader.git
```

## ⚙️ Configuración

Antes de cargar el código, modifica las siguientes constantes en el archivo `.ino`:

```cpp
const char* WIFI_SSID = "TU_WIFI";              // Tu red WiFi
const char* WIFI_PASSWORD = "TU_PASSWORD";      // Contraseña WiFi
const char* API_BASE_URL = "http://tu-servidor.com";  // URL base del API
```

### Dirección I2C del LCD

Si tu LCD no funciona, verifica la dirección I2C. Puede ser `0x27` o `0x3F`:

```cpp
#define LCD_ADDRESS 0x27  // Cambiar a 0x3F si es necesario
```

Para encontrar la dirección, usa el sketch **I2C Scanner**.

## 🚀 Funcionamiento

### Formato de Códigos QR

1. **Entrada** (formato: `codigoQR|idVehiculo`)
   - Ejemplo: `ABC123DEF456|42`
   - El sistema enviará:
     ```json
     {
       "uuidCodigoQR": "ABC123DEF456",
       "vehiculo": {
         "id": 42
       }
     }
     ```
   - Endpoint: `POST /api/entrada-salida/pensionado`

2. **Salida** (formato: `folioTicket`)
   - Ejemplo: `XYZ789GHI012`
   - Endpoint: `POST /api/entrada-salida/pensionado/salida/XYZ789GHI012`

### Mensajes en LCD

- **Entrada exitosa:** "Entrada Registrada OK"
- **Salida exitosa:** "Salida Registrada OK"
- **Error:** "Error Entrada/Salida - Intente de nuevo"
- **Esperando:** "Escanee codigo QR..."

## 📝 Carga del Código

1. Conecta el **ESP32-CAM** al programador FTDI
2. Presiona el botón **RESET** mientras conectas (modo flash)
3. En Arduino IDE:
   - Selecciona: `Herramientas` → `Placa` → `AI Thinker ESP32-CAM`
   - Puerto: El puerto COM correspondiente
   - Upload Speed: `115200`
4. Carga el sketch
5. Presiona **RESET** después de cargar

## 🔍 Debugging

Monitor Serial a **115200 baudios** muestra:
- Estado de conexión WiFi
- IP asignada
- Códigos QR detectados
- Respuestas del servidor
- Errores de comunicación

## ⚠️ Notas Importantes

- El ESP32-CAM requiere **al menos 5V/2A** de alimentación estable
- El escaneo QR funciona mejor con **buena iluminación**
- Mantén el código QR a **10-30cm** de la cámara
- Hay un **cooldown de 3 segundos** entre escaneos del mismo código
- La resolución está optimizada a **QVGA (320x240)** para mejor rendimiento

## 🛠️ Troubleshooting

### La cámara no inicializa
- Verifica las conexiones del módulo de cámara
- Asegúrate de tener suficiente corriente (min 2A)
- Revisa que el modelo de ESP32-CAM sea AI-THINKER

### El LCD no muestra nada
- Verifica la dirección I2C (prueba 0x27 o 0x3F)
- Ajusta el contraste del LCD con el potenciómetro
- Verifica las conexiones SDA/SCL

### No detecta códigos QR
- Mejora la iluminación del área
- Ajusta la distancia al código QR
- Verifica que el QR tenga buen contraste

### Error de WiFi
- Verifica SSID y contraseña
- Asegúrate de estar en rango del router
- El ESP32 solo soporta WiFi 2.4GHz (no 5GHz)

## 📄 Licencia

Este proyecto es de código abierto para uso educativo.

## 👨‍💻 Autor

Sistema de Estacionamiento - Control de Acceso QR

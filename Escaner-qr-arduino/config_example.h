// Ejemplo de configuración para diferentes modelos de ESP32-CAM

// ===== CONFIGURACIÓN GENERAL =====
const char* WIFI_SSID = "MiWiFi";
const char* WIFI_PASSWORD = "MiPassword123";
const char* API_BASE_URL = "http://192.168.1.100:8080";

// ===== DIRECCIONES I2C COMUNES PARA LCD =====
// Prueba primero con 0x27, si no funciona cambia a 0x3F
#define LCD_ADDRESS 0x27  // También puede ser: 0x3F

// ===== EJEMPLOS DE CÓDIGOS QR =====
/*
ENTRADA (con ID de vehículo):
  Código QR: "ABC123DEF456|42"
  
  Se enviará al endpoint:
  POST http://192.168.1.100:8080/api/entrada-salida/pensionado
  
  Body JSON:
  {
    "uuidCodigoQR": "ABC123DEF456",
    "vehiculo": {
      "id": 42
    }
  }

SALIDA (sin ID):
  Código QR: "XYZ789GHI012"
  
  Se enviará al endpoint:
  POST http://192.168.1.100:8080/api/entrada-salida/pensionado/salida/XYZ789GHI012
  
  Body: vacío
*/

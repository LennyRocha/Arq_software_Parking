/*
 * ESP32-CAM QR Scanner - VERSIÓN SIMPLE
 * 
 * Esta versión NO requiere librerías QR complicadas
 * Captura imagen y la envía a un servidor Python que procesa el QR
 * 
 * Hardware:
 * - ESP32-CAM con OV2640
 * - LCD 16x2 I2C
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "esp_camera.h"

// ===== CONFIGURACIÓN =====
const char* WIFI_SSID = "NOMBRE_WIFI";
const char* WIFI_PASSWORD = "CONTRASEÑA_WIFI";
const char* API_BASE_URL = "http://localhost:8080"; // API de Spring Boot ParKing
const char* PYTHON_SERVER = "http://localhost:5000"; // Servidor Python (QR processor)

// ===== PINES CÁMARA ESP32-CAM AI-THINKER =====
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// ===== LCD =====
#define LCD_ADDRESS 0x27
#define I2C_SDA 14
#define I2C_SCL 15

LiquidCrystal_I2C lcd(LCD_ADDRESS, 16, 2);

String lastQR = "";
unsigned long lastScan = 0;
#define COOLDOWN 3000

// ===== FUNCIONES =====

void setupWiFi() {
  lcd.clear();
  lcd.print("Conectando WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries++ < 20) {
    delay(500);
    Serial.print(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi OK: " + WiFi.localIP().toString());
    lcd.clear();
    lcd.print("WiFi OK");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
    delay(2000);
  } else {
    lcd.clear();
    lcd.print("Error WiFi!");
  }
}

void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Error init camera");
    lcd.clear();
    lcd.print("Cam Error!");
    while(1);
  }
  Serial.println("Camera OK");
}

// Enviar imagen al servidor Python y obtener QR
String scanQRFromPython() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi desconectado!");
    return "";
  }
  
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("❌ Error captura imagen");
    return "";
  }

  Serial.printf("  📦 Imagen: %d bytes\n", fb->len);
  Serial.printf("  🌐 Enviando a: %s/scan-qr\n", PYTHON_SERVER);

  HTTPClient http;
  http.begin(String(PYTHON_SERVER) + "/scan-qr");
  http.addHeader("Content-Type", "image/jpeg");
  http.setTimeout(5000);
  
  int code = http.POST(fb->buf, fb->len);
  String qrData = "";
  
  Serial.printf("  📡 Respuesta HTTP: %d\n", code);
  
  if (code == 200) {
    String response = http.getString();
    Serial.printf("  📄 Response: %s\n", response.c_str());
    
    StaticJsonDocument<512> doc;
    if (!deserializeJson(doc, response)) {
      if (doc.containsKey("qr_data")) {
        qrData = doc["qr_data"].as<String>();
        if (qrData.length() > 0) {
          Serial.printf("  ✅ QR: %s\n", qrData.c_str());
        }
      }
    }
  } else if (code > 0) {
    Serial.printf("  ❌ Error HTTP: %d - %s\n", code, http.getString().c_str());
  } else {
    Serial.printf("  ❌ Error conexión: %s\n", http.errorToString(code).c_str());
  }
  
  http.end();
  esp_camera_fb_return(fb);
  return qrData;
}

// Parsear QR: formato "codigo|id" o solo "codigo"
void parseQR(String data, String &codigo, int &vehiculoId, bool &isEntrada) {
  int idx = data.indexOf('|');
  if (idx > 0) {
    isEntrada = true;
    codigo = data.substring(0, idx);
    vehiculoId = data.substring(idx + 1).toInt();
  } else {
    isEntrada = false;
    codigo = data;
    vehiculoId = 0;
  }
}

// Registrar ENTRADA
bool registrarEntrada(String codigo, int vehiculoId) {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  http.begin(String(API_BASE_URL) + "/api/entrada-salida/pensionado");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> doc;
  doc["uuidCodigoQR"] = codigo;
  JsonObject vehiculo = doc.createNestedObject("vehiculo");
  vehiculo["id"] = vehiculoId;
  
  String body;
  serializeJson(doc, body);
  
  int code = http.POST(body);
  bool ok = (code >= 200 && code < 300);
  
  Serial.printf("Entrada -> %d: %s\n", code, body.c_str());
  http.end();
  return ok;
}

// Registrar SALIDA
bool registrarSalida(String folio) {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  http.begin(String(API_BASE_URL) + "/api/entrada-salida/pensionado/salida/" + folio);
  http.addHeader("Content-Type", "application/json");
  
  int code = http.PUT("");
  bool ok = (code >= 200 && code < 300);
  
  Serial.printf("Salida -> %d\n", code);
  http.end();
  return ok;
}

void procesarQR(String data) {
  if (data == lastQR && (millis() - lastScan) < COOLDOWN) return;
  
  lastQR = data;
  lastScan = millis();
  
  Serial.println("\n=== QR: " + data + " ===");
  
  lcd.clear();
  lcd.print("Procesando...");
  
  String codigo;
  int vehiculoId;
  bool isEntrada;
  parseQR(data, codigo, vehiculoId, isEntrada);
  
  bool ok = false;
  if (isEntrada) {
    Serial.printf("ENTRADA: %s (ID:%d)\n", codigo.c_str(), vehiculoId);
    ok = registrarEntrada(codigo, vehiculoId);
    lcd.clear();
    lcd.print(ok ? "Entrada OK" : "Error Entrada");
  } else {
    Serial.printf("SALIDA: %s\n", codigo.c_str());
    ok = registrarSalida(codigo);
    lcd.clear();
    lcd.print(ok ? "Salida OK" : "Error Salida");
  }
  
  delay(3000);
  lcd.clear();
  lcd.print("Escanee QR...");
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== ESP32-CAM QR Scanner ===");
  
  Wire.begin(I2C_SDA, I2C_SCL);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Iniciando...");
  
  setupWiFi();
  setupCamera();
  
  lcd.clear();
  lcd.print("Escanee QR...");
  Serial.println("Sistema listo\n");
}

// ===== LOOP =====
void loop() {
  // Debug: mostrar que está escaneando
  static unsigned long lastDebug = 0;
  if (millis() - lastDebug > 5000) {
    Serial.println("⏱️ Escaneando... (cada 0.5s)");
    lastDebug = millis();
  }
  
  Serial.print("📸 Capturando imagen... ");
  String qr = scanQRFromPython();
  
  if (qr.length() > 0) {
    Serial.println("✓ QR detectado!");
    procesarQR(qr);
  } else {
    Serial.println("○ No QR");
  }
  
  if (millis() - lastScan > COOLDOWN) {
    lastQR = "";
  }
  
  delay(500);
}

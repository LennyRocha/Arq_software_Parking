/*
 * ESP32-CAM QR Code Scanner para Sistema de Estacionamiento
 * 
 * Hardware:
 * - ESP32-CAM con cámara OV2640
 * - LCD 16x2 ARD-380 (I2C)
 * 
 * Funcionalidad:
 * - Escanea códigos QR en tiempo real
 * - Detecta entrada (formato: codigoQR|idVehiculo) o salida (solo codigoQR)
 * - Envía peticiones HTTP al servidor
 * - Muestra confirmación en pantalla LCD
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "esp_camera.h"
#include "quirc.h"

// ===== CONFIGURACIÓN - MODIFICA ESTOS VALORES =====
const char* WIFI_SSID = "TU_WIFI";           // Cambia por tu red WiFi
const char* WIFI_PASSWORD = "TU_PASSWORD";   // Cambia por tu contraseña
const char* API_BASE_URL = "http://tu-servidor.com"; // URL base del API

// ===== PINES DE LA CÁMARA ESP32-CAM (AI-THINKER) =====
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

// ===== CONFIGURACIÓN LCD =====
#define LCD_COLS 16
#define LCD_ROWS 2
#define LCD_ADDRESS 0x27  // Dirección I2C común, puede ser 0x3F

// ===== VARIABLES GLOBALES =====
LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLS, LCD_ROWS);
struct quirc *qr_recognizer = NULL;
camera_fb_t *fb = NULL;

String lastQRCode = "";
unsigned long lastScanTime = 0;
const unsigned long SCAN_COOLDOWN = 3000; // 3 segundos entre escaneos del mismo código

// ===== FUNCIONES =====

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
  config.xclk_freq_hz = 10000000;
  config.pixel_format = PIXFORMAT_GRAYSCALE;
  
  // Configuración para detección de QR
  config.frame_size = FRAMESIZE_QVGA; // 320x240
  config.jpeg_quality = 12;
  config.fb_count = 1;

  // Inicializar cámara
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Error al inicializar la cámara: 0x%x\n", err);
    lcd.clear();
    lcd.print("Error Camera!");
    while(1);
  }

  // Configurar sensor
  sensor_t * s = esp_camera_sensor_get();
  s->set_framesize(s, FRAMESIZE_QVGA);
  s->set_brightness(s, 0);     // -2 a 2
  s->set_contrast(s, 0);       // -2 a 2
  s->set_saturation(s, 0);     // -2 a 2
  
  Serial.println("Cámara inicializada correctamente");
}

void setupWiFi() {
  lcd.clear();
  lcd.print("Conectando WiFi");
  Serial.print("Conectando a WiFi");
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    lcd.clear();
    lcd.print("WiFi Conectado");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
    delay(2000);
  } else {
    Serial.println("\nError de conexión WiFi");
    lcd.clear();
    lcd.print("Error WiFi!");
    delay(3000);
  }
}

void setupLCD() {
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Iniciando...");
  Serial.println("LCD inicializado");
}

void setupQR() {
  qr_recognizer = quirc_new();
  if (!qr_recognizer) {
    Serial.println("Error al crear reconocedor QR");
    lcd.clear();
    lcd.print("Error QR Init!");
    while(1);
  }
  
  // Configurar para imágenes de 320x240
  if (quirc_resize(qr_recognizer, 320, 240) < 0) {
    Serial.println("Error al redimensionar reconocedor QR");
    quirc_destroy(qr_recognizer);
    lcd.clear();
    lcd.print("Error QR Size!");
    while(1);
  }
  
  Serial.println("Reconocedor QR inicializado");
}

// Parsear el código QR y determinar si es entrada o salida
void parseQRCode(String qrData, String &codigoQR, int &vehiculoId, bool &isEntrada) {
  int separatorIndex = qrData.indexOf('|');
  
  if (separatorIndex > 0) {
    // Es una ENTRADA (formato: codigoQR|idVehiculo)
    isEntrada = true;
    codigoQR = qrData.substring(0, separatorIndex);
    String idStr = qrData.substring(separatorIndex + 1);
    vehiculoId = idStr.toInt();
    
    Serial.println("Tipo: ENTRADA");
    Serial.println("Código QR: " + codigoQR);
    Serial.println("ID Vehículo: " + String(vehiculoId));
  } else {
    // Es una SALIDA (solo codigoQR)
    isEntrada = false;
    codigoQR = qrData;
    vehiculoId = 0;
    
    Serial.println("Tipo: SALIDA");
    Serial.println("Folio: " + codigoQR);
  }
}

// Enviar petición de ENTRADA al servidor
bool registrarEntrada(String codigoQR, int vehiculoId) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi no conectado");
    return false;
  }

  HTTPClient http;
  String url = String(API_BASE_URL) + "/api/entrada-salida/pensionado";
  
  Serial.println("POST: " + url);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Crear JSON
  StaticJsonDocument<200> doc;
  doc["uuidCodigoQR"] = codigoQR;
  JsonObject vehiculo = doc.createNestedObject("vehiculo");
  vehiculo["id"] = vehiculoId;
  
  String requestBody;
  serializeJson(doc, requestBody);
  Serial.println("Body: " + requestBody);
  
  int httpCode = http.POST(requestBody);
  
  bool success = false;
  if (httpCode > 0) {
    Serial.printf("Código de respuesta: %d\n", httpCode);
    String response = http.getString();
    Serial.println("Respuesta: " + response);
    
    if (httpCode >= 200 && httpCode < 300) {
      success = true;
    }
  } else {
    Serial.printf("Error en petición: %s\n", http.errorToString(httpCode).c_str());
  }
  
  http.end();
  return success;
}

// Enviar petición de SALIDA al servidor
bool registrarSalida(String folioTicket) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi no conectado");
    return false;
  }

  HTTPClient http;
  String url = String(API_BASE_URL) + "/api/entrada-salida/pensionado/salida/" + folioTicket;
  
  Serial.println("POST: " + url);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST("");
  
  bool success = false;
  if (httpCode > 0) {
    Serial.printf("Código de respuesta: %d\n", httpCode);
    String response = http.getString();
    Serial.println("Respuesta: " + response);
    
    if (httpCode >= 200 && httpCode < 300) {
      success = true;
    }
  } else {
    Serial.printf("Error en petición: %s\n", http.errorToString(httpCode).c_str());
  }
  
  http.end();
  return success;
}

// Mostrar mensaje en LCD
void mostrarMensajeLCD(String linea1, String linea2 = "") {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(linea1);
  
  if (linea2.length() > 0) {
    lcd.setCursor(0, 1);
    lcd.print(linea2);
  }
}

// Procesar el código QR detectado
void procesarQR(String qrData) {
  Serial.println("\n========================================");
  Serial.println("QR DETECTADO: " + qrData);
  
  // Evitar procesar el mismo código varias veces
  if (qrData == lastQRCode && (millis() - lastScanTime) < SCAN_COOLDOWN) {
    Serial.println("Código ya procesado recientemente");
    return;
  }
  
  lastQRCode = qrData;
  lastScanTime = millis();
  
  mostrarMensajeLCD("Procesando...", qrData.substring(0, 16));
  
  // Parsear datos
  String codigoQR;
  int vehiculoId;
  bool isEntrada;
  parseQRCode(qrData, codigoQR, vehiculoId, isEntrada);
  
  // Enviar al servidor
  bool success = false;
  if (isEntrada) {
    success = registrarEntrada(codigoQR, vehiculoId);
    if (success) {
      mostrarMensajeLCD("Entrada", "Registrada OK");
      Serial.println("✓ Entrada registrada correctamente");
    } else {
      mostrarMensajeLCD("Error Entrada", "Intente de nuevo");
      Serial.println("✗ Error al registrar entrada");
    }
  } else {
    success = registrarSalida(codigoQR);
    if (success) {
      mostrarMensajeLCD("Salida", "Registrada OK");
      Serial.println("✓ Salida registrada correctamente");
    } else {
      mostrarMensajeLCD("Error Salida", "Intente de nuevo");
      Serial.println("✗ Error al registrar salida");
    }
  }
  
  delay(3000);
  mostrarMensajeLCD("Escanee codigo", "QR...");
  Serial.println("========================================\n");
}

// Escanear y decodificar QR
String scanQRCode() {
  fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Error al capturar imagen");
    return "";
  }

  // Obtener buffer de quirc
  uint8_t *image = quirc_begin(qr_recognizer, NULL, NULL);
  
  // Copiar datos de la cámara al buffer de quirc
  memcpy(image, fb->buf, fb->len);
  
  // Finalizar reconocimiento
  quirc_end(qr_recognizer);

  // Buscar códigos QR
  int count = quirc_count(qr_recognizer);
  
  String qrData = "";
  
  if (count > 0) {
    struct quirc_code code;
    struct quirc_data data;
    quirc_decode_error_t err;
    
    quirc_extract(qr_recognizer, 0, &code);
    err = quirc_decode(&code, &data);
    
    if (err == QUIRC_SUCCESS) {
      qrData = String((char*)data.payload);
    }
  }
  
  esp_camera_fb_return(fb);
  fb = NULL;
  
  return qrData;
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32-CAM QR Scanner ===");
  
  // Inicializar LCD
  setupLCD();
  delay(1000);
  
  // Inicializar WiFi
  setupWiFi();
  
  // Inicializar cámara
  mostrarMensajeLCD("Init Camara...");
  setupCamera();
  delay(500);
  
  // Inicializar reconocedor QR
  mostrarMensajeLCD("Init QR...");
  setupQR();
  delay(500);
  
  // Listo para escanear
  mostrarMensajeLCD("Escanee codigo", "QR...");
  Serial.println("\n=== Sistema listo ===");
  Serial.println("Esperando códigos QR...\n");
}

// ===== LOOP =====
void loop() {
  // Verificar conexión WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado, reconectando...");
    setupWiFi();
  }
  
  // Escanear código QR
  String qrData = scanQRCode();
  
  if (qrData.length() > 0) {
    procesarQR(qrData);
  }
  
  delay(100); // Pequeña pausa entre escaneos
}

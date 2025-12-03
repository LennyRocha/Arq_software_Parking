#include <WiFi.h>
#include <ArduinoOTA.h>

const char* ssid = "NOMBRE_WIFI";
const char* password = "CONTRASEÑA_WIFI";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Error conectando… reiniciando");
    delay(5000);
    ESP.restart();
  }

  ArduinoOTA.setHostname("ESP32CAM");
  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle();
}

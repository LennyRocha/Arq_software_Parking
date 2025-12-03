# 📚 Índice de Documentación - ESP32-CAM QR Scanner

## 🚀 Inicio Rápido

1. **[README.md](README.md)** - Inicio aquí
   - Descripción general del proyecto
   - Arquitectura del sistema
   - Hardware y software necesario
   - Características principales

## 📖 Guías de Instalación

2. **[INSTALACION.md](INSTALACION.md)** - Instalación paso a paso
   - Requisitos previos
   - Instalación de software
   - Configuración de red y firewall
   - Configuración del código
   - Conexiones hardware
   - Carga del código al ESP32-CAM
   - Checklist de verificación

## 🧪 Pruebas y Solución de Problemas

3. **[COMO_PROBAR.md](COMO_PROBAR.md)** - Guía de pruebas detallada
   - Verificación del servidor Python
   - Pruebas de detección de QR
   - Monitoreo del ESP32-CAM
   - Diagnóstico de problemas
   - Flujo de prueba completo

4. **[SOLUCION_FIREWALL.md](SOLUCION_FIREWALL.md)** - Solución "Connection Refused"
   - Configuración del firewall de Windows
   - Múltiples opciones de solución
   - Verificación de conectividad
   - Troubleshooting de red

## 💻 Archivos del Proyecto

### Código Arduino
- **`ESP32-CAM_QR_Scanner/ESP32-CAM_QR_Scanner.ino`**
  - Código principal del ESP32-CAM
  - Captura de imagen y comunicación WiFi
  - Control del LCD
  - Comunicación con API

### Servidor Python
- **`python_qr_server.py`**
  - Servidor Flask para procesar QR
  - Decodificación con OpenCV + pyzbar
  - Endpoints REST

### Herramientas de Prueba
- **`test_sistema.py`**
  - Generador de códigos QR de prueba
  - Pruebas de conectividad
  - Validación del sistema completo

## 📋 Flujo de Trabajo Recomendado

### Primera Vez (Setup Completo)

```
1. README.md (leer arquitectura)
   ↓
2. INSTALACION.md (seguir todos los pasos)
   ↓
3. COMO_PROBAR.md (verificar funcionamiento)
   ↓
4. SOLUCION_FIREWALL.md (si hay problemas de red)
```

### Uso Diario

```
1. Ejecutar: python python_qr_server.py
   ↓
2. Conectar y encender ESP32-CAM
   ↓
3. Verificar Monitor Serial (HTTP: 200)
   ↓
4. ¡Listo para escanear QR!
```

### Troubleshooting

```
¿Problema de conexión?
   → SOLUCION_FIREWALL.md

¿LCD no funciona?
   → README.md (sección Troubleshooting)

¿No detecta QR?
   → COMO_PROBAR.md (sección Diagnóstico)

¿Error de compilación?
   → INSTALACION.md (verificar librerías)
```

## 🎯 Documentos por Nivel de Usuario

### 👤 Usuario Final
- **README.md** - Vista general
- **COMO_PROBAR.md** - Operación básica

### 🔧 Instalador/Técnico
- **INSTALACION.md** - Setup completo
- **SOLUCION_FIREWALL.md** - Configuración de red

### 👨‍💻 Desarrollador
- **Todos los documentos** - Referencia completa
- **Código fuente** - Para modificaciones

## 📞 Referencias Rápidas

### Formato de Códigos QR

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Entrada | `codigo\|id` | `ABC123\|42` |
| Salida | `codigo` | `XYZ789` |

### Puertos y Servicios

| Servicio | Puerto | URL |
|----------|--------|-----|
| Servidor Python | 5000 | `http://192.168.x.x:5000` |
| API Spring Boot | 8080 | `http://192.168.x.x:8080` |

### Conexiones Hardware

| LCD | ESP32-CAM |
|-----|-----------|
| SDA | GPIO 14 |
| SCL | GPIO 15 |
| VCC | 5V |
| GND | GND |

## ⚡ Comandos Útiles

```bash
# Verificar IP
ipconfig

# Configurar Firewall (PowerShell Admin)
netsh advfirewall firewall add rule name="Python QR Server" dir=in action=allow protocol=TCP localport=5000

# Iniciar servidor Python
python python_qr_server.py

# Generar QR de prueba
python test_sistema.py

# Verificar servidor
curl http://192.168.x.x:5000/health
```

## 📝 Notas Importantes

- ⚠️ ESP32 solo soporta WiFi 2.4GHz (no 5GHz)
- ⚠️ Alimentación mínima: 5V/2A
- ⚠️ Distancia óptima QR: 15-30cm
- ⚠️ Buena iluminación es crítica
- ⚠️ Firewall debe permitir puerto 5000

---

**💡 Consejo:** Comienza con **README.md** para entender el sistema, luego sigue **INSTALACION.md** paso a paso.

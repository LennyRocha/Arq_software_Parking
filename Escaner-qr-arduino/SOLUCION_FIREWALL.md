# 🔥 Solución al Error "Connection Refused"

## ❌ Problema Detectado

```
❌ Error conexión: connection refused
```

Esto significa que el **Firewall de Windows** está bloqueando las conexiones del ESP32-CAM al servidor Python.

---

## ✅ Solución Rápida (Recomendada)

### Opción 1: Permitir Python en el Firewall (Windows)

**Cuando ejecutes `python python_qr_server.py`, Windows debería mostrar una alerta del firewall.**

1. **Ejecuta el servidor Python** (si no lo has hecho):
   ```bash
   python python_qr_server.py
   ```

2. **Windows Defender mostrará un cuadro de diálogo:**
   ```
   Windows Defender Firewall ha bloqueado algunas características de esta aplicación
   ```

3. **Marca las casillas:**
   - ✅ **Redes privadas** (como redes domésticas o del trabajo)
   - ✅ **Redes públicas** (opcional, solo si estás en red pública)

4. **Click en "Permitir acceso"**

5. **Reinicia el ESP32-CAM** (presiona el botón RESET)

---

### Opción 2: Agregar Regla Manualmente (Firewall de Windows)

Si no apareció el cuadro de diálogo:

1. **Abre PowerShell como Administrador:**
   - Click derecho en el botón de Windows
   - Selecciona "Windows PowerShell (Administrador)" o "Terminal (Administrador)"

2. **Ejecuta este comando:**
   ```powershell
   netsh advfirewall firewall add rule name="Python QR Server" dir=in action=allow protocol=TCP localport=5000
   ```

3. **Deberías ver:**
   ```
   Correcto.
   ```

4. **Reinicia el servidor Python** (Ctrl+C y vuelve a ejecutar):
   ```bash
   python python_qr_server.py
   ```

5. **Reinicia el ESP32-CAM**

---

### Opción 3: Desactivar Firewall Temporalmente (Solo para pruebas)

**⚠️ NO RECOMENDADO para uso permanente**

1. Abre "Windows Defender Firewall"
2. Click en "Activar o desactivar Firewall de Windows"
3. Desactiva para redes privadas (temporalmente)
4. Prueba el sistema
5. **¡NO OLVIDES VOLVER A ACTIVARLO!**

---

### Opción 4: Usar localhost (Si ESP32 y PC están conectados por USB)

**Solo funciona si el ESP32-CAM tiene acceso directo a la PC vía red local.**

Esta opción no aplica en tu caso porque el ESP32-CAM está por WiFi.

---

## 🧪 Verificar que Funcionó

### 1. Probar desde tu PC

Abre otra terminal PowerShell y ejecuta:

```powershell
curl http://192.168.0.10:5000/health
```

**Debe responder:**
```json
{"status":"ok"}
```

### 2. Verificar en el Monitor Serial del ESP32-CAM

Después de permitir el firewall, deberías ver:

```
📸 Capturando imagen... 
  📦 Imagen: 9420 bytes
  🌐 Enviando a: http://192.168.0.10:5000/scan-qr
  📡 Respuesta HTTP: 200          ← ✅ Ahora dice 200 en lugar de -1
  📄 Response: {"qr_data":""}
○ No QR
```

### 3. Probar con un QR

Una vez que veas **HTTP: 200**, acerca un código QR a la cámara y deberías ver:

```
📸 Capturando imagen... 
  📦 Imagen: 9420 bytes
  🌐 Enviando a: http://192.168.0.10:5000/scan-qr
  📡 Respuesta HTTP: 200
  📄 Response: {"qr_data":"ABC123|42"}
  ✅ QR: ABC123|42
✓ QR detectado!

=== QR: ABC123|42 ===
ENTRADA: ABC123 (ID:42)
```

---

## 📋 Checklist de Solución

- [ ] Ejecutar `python python_qr_server.py`
- [ ] Permitir Python en el Firewall de Windows
- [ ] Verificar con `curl http://192.168.0.10:5000/health`
- [ ] Reiniciar ESP32-CAM (botón RESET)
- [ ] Ver en Monitor Serial: `📡 Respuesta HTTP: 200`
- [ ] Probar con un código QR

---

## 🆘 Si Sigue Sin Funcionar

### Verifica la IP correcta

```powershell
ipconfig
```

Busca la IP de tu adaptador WiFi (generalmente empieza con 192.168.x.x)

### Verifica que estén en la misma red

- ESP32-CAM y tu PC **deben estar conectados a la misma red WiFi**
- Verifica el nombre de red (SSID) en ambos dispositivos

### Prueba con otra IP

Si tienes múltiples adaptadores de red (como VirtualBox, VMware, etc.), usa la IP del adaptador WiFi principal.

En el código del ESP32, cambia:
```cpp
const char* PYTHON_SERVER = "http://192.168.0.10:5000";
```

Por la IP correcta que obtuviste con `ipconfig`.

---

## ✅ Solución Aplicada

Una vez que permitas Python en el firewall, **todo funcionará automáticamente**. 🎉

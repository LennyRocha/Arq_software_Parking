# 🔧 Solución al Error 500 de Mercado Pago

## ✅ Cambios realizados:

### 1. **Módulo de Mercado Pago creado** 🆕
Se creó el módulo completo del backend en:
```
backendparking/src/main/java/utez/edu/mx/backendparking/modules/mercadopago/
├── MercadoPagoController.java       # Controlador REST
├── MercadoPagoService.java          # Lógica de negocio
├── MercadoPagoConfig.java           # Configuración del SDK
└── dto/
    ├── PreferenciaRequest.java      # DTO de entrada
    └── PreferenciaResponse.java     # DTO de salida
```

### 2. **Dependencia agregada al pom.xml** 📦
Se agregó el SDK oficial de Mercado Pago:
```xml
<dependency>
    <groupId>com.mercadopago</groupId>
    <artifactId>sdk-java</artifactId>
    <version>2.1.29</version>
</dependency>
```

### 3. **Archivos de configuración protegidos** 🔒

#### Backend:
- ✅ Creado `application.properties.example` (plantilla sin credenciales)
- ✅ `application.properties` agregado al `.gitignore`
- ⚠️ **IMPORTANTE:** Tu archivo real con credenciales NO se subirá a Git

#### Frontend:
- ✅ Ya existe `.env.example` (plantilla)
- ✅ `.env` y variantes agregados al `.gitignore`
- ⚠️ **IMPORTANTE:** Tu archivo `.env` con credenciales NO se subirá a Git

---

## 🚀 Pasos para resolver el error:

### 1. **Recompila el proyecto Maven**

Desde la raíz del backend:
```bash
cd backendparking
./mvnw clean install
```

O si estás en Windows:
```bash
mvnw.cmd clean install
```

### 2. **Reinicia el servidor Spring Boot**

```bash
./mvnw spring-boot:run
```

O desde tu IDE (IntelliJ, Eclipse, VS Code).

### 3. **Verifica que el endpoint esté disponible**

El endpoint ahora está disponible en:
```
POST http://localhost:8080/api/mercadopago/crear-preferencia
```

Puedes probarlo con:
```json
{
  "pensionId": 1,
  "usuarioEmail": "test@example.com",
  "usuarioNombre": "Juan Pérez"
}
```

### 4. **Prueba desde el frontend**

1. Asegúrate de que el frontend esté corriendo: `npm run dev`
2. Ve a la página de registro de pensión
3. Completa los pasos hasta llegar al pago
4. Click en "Proceder al pago"
5. Deberías ser redirigido a Mercado Pago

---

## 🔍 Verificación de credenciales:

### Backend (`application.properties`):
```properties
# ✅ Tus credenciales están configuradas:
mercadopago.access.token=APP_USR-6789903038443461-112315-...
mercadopago.public.key=APP_USR-eee9adc1-c7c8-45f9-b2a4-...
```

### Frontend (`.env`):
```env
# ✅ Tu Public Key está configurada:
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-eee9adc1-c7c8-45f9-b2a4-...
```

⚠️ **NOTA:** Estás usando credenciales de **PRODUCCIÓN** (APP_USR). 
- Para **desarrollo/pruebas**, deberías usar credenciales de **PRUEBA** (TEST-xxx).
- Las credenciales de producción cobran comisiones reales.

---

## 🧪 Cambiar a credenciales de prueba (recomendado):

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.mx/developers/panel/app)
2. Selecciona tu aplicación
3. Ve a "Credenciales"
4. **Selecciona "Credenciales de prueba"** (no producción)
5. Copia las nuevas credenciales (empiezan con `TEST-`)
6. Reemplaza en `application.properties` y `.env`
7. Reinicia ambos servidores

---

## 📝 Endpoint creado:

### `POST /api/mercadopago/crear-preferencia`

**Request:**
```json
{
  "pensionId": 1,
  "usuarioEmail": "usuario@email.com",
  "usuarioNombre": "Nombre del Usuario"
}
```

**Response (éxito):**
```json
{
  "data": {
    "id": "123456789-0abc-def1-2345-6789abcdef01",
    "initPoint": "https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=...",
    "sandboxInitPoint": "https://sandbox.mercadopago.com.mx/checkout/v1/redirect?pref_id=..."
  },
  "error": false,
  "status": 200,
  "message": "Preferencia creada exitosamente"
}
```

**Response (error):**
```json
{
  "data": null,
  "error": true,
  "status": 500,
  "message": "Error al crear la preferencia de Mercado Pago: [mensaje de error]"
}
```

---

## 🐛 Si el error persiste:

### 1. Revisa los logs del backend
Busca mensajes de error en la consola donde corre Spring Boot.

### 2. Verifica las credenciales
```bash
# En application.properties, asegúrate de que no haya espacios extra:
mercadopago.access.token=APP_USR-...
# (sin espacios antes o después del =)
```

### 3. Verifica que la pensión existe
El endpoint busca la pensión por ID. Asegúrate de que exista en tu base de datos:
```sql
SELECT * FROM pension WHERE id = 1;
```

### 4. Revisa el CORS
El controlador ya tiene CORS habilitado para `http://localhost:5173`.
Si usas otro puerto, actualiza en `MercadoPagoController.java`:
```java
@CrossOrigin(origins = {"http://localhost:TU_PUERTO"})
```

---

## 📚 Archivos de ejemplo creados:

- ✅ `application.properties.example` - Backend (sin credenciales reales)
- ✅ `.env.example` - Frontend (sin credenciales reales)

**Para nuevos desarrolladores:**
1. Copia el `.example` al archivo real
2. Agrega tus credenciales
3. Los archivos reales no se subirán a Git

---

## ✅ Checklist final:

- [ ] Dependencia de MP agregada al `pom.xml`
- [ ] Proyecto Maven recompilado (`./mvnw clean install`)
- [ ] Servidor Spring Boot reiniciado
- [ ] Credenciales correctas en `application.properties`
- [ ] Credenciales correctas en `.env` (frontend)
- [ ] Frontend reiniciado (`npm run dev`)
- [ ] `.gitignore` actualizado (archivos protegidos)

---

¡Listo! El error 500 debería estar resuelto. 🎉

# Configuración de Mercado Pago para parKing

Este documento explica cómo configurar Mercado Pago tanto en el frontend como en el backend del sistema parKing.

## 📋 Índice

1. [Obtener credenciales de Mercado Pago](#obtener-credenciales)
2. [Configuración del Frontend](#configuración-del-frontend)
3. [Configuración del Backend](#configuración-del-backend)
4. [Pruebas con credenciales de test](#pruebas)
5. [Producción](#producción)

---

## 🔑 Obtener credenciales de Mercado Pago

### Paso 1: Crear cuenta en Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.mx/developers)
2. Inicia sesión o crea una cuenta
3. Acepta los términos y condiciones de desarrollador

### Paso 2: Crear una aplicación

1. En el panel de desarrollador, ve a **"Tus integraciones"**
2. Click en **"Crear aplicación"**
3. Llena los datos:
   - **Nombre:** parKing Estacionamiento
   - **Modelo de integración:** Checkout Pro
   - **Producto:** Pagos online
4. Click en **"Crear aplicación"**

### Paso 3: Obtener credenciales de PRUEBA

1. En tu aplicación, ve a la sección **"Credenciales"**
2. Selecciona el modo **"Credenciales de prueba"**
3. Encontrarás:
   - **Public Key:** `TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **Access Token:** `TEST-xxxxxxxxxxxxxxxx...`

⚠️ **IMPORTANTE:** Para desarrollo, SIEMPRE usa las credenciales de PRUEBA.

---

## 🎨 Configuración del Frontend

### Archivo: `Frontend-web/.env`

1. Copia el archivo de ejemplo:
   ```bash
   cd Frontend-web
   cp .env.example .env
   ```

2. Edita el archivo `.env` y reemplaza la Public Key:
   ```env
   VITE_API_URL=http://localhost:8080
   
   # Mercado Pago - Credenciales de prueba
   VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui
   ```

3. Reemplaza `TEST-tu-public-key-aqui` con tu **Public Key de prueba**

4. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### ¿Dónde se usa?

El Public Key se usa en el frontend para:
- Inicializar el SDK de Mercado Pago
- Crear preferencias de pago desde el navegador
- Mostrar la pasarela de pago

---

## ⚙️ Configuración del Backend

### Archivo: `backendparking/src/main/resources/application.properties`

1. Abre el archivo `application.properties`

2. Busca la sección de Mercado Pago:
   ```properties
   # Mercado Pago - Credenciales
   mercadopago.access.token=TEST-xxxxxxxxxxxxxxxx...
   mercadopago.public.key=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   
   # URLs de retorno
   mercadopago.success.url=http://localhost:5173/registro-pension?status=approved
   mercadopago.failure.url=http://localhost:5173/registro-pension?status=rejected
   mercadopago.pending.url=http://localhost:5173/registro-pension?status=pending
   ```

3. Reemplaza las credenciales:
   - `mercadopago.access.token` → Tu **Access Token de prueba**
   - `mercadopago.public.key` → Tu **Public Key de prueba**

4. Verifica las URLs de retorno:
   - Si usas otro puerto, ajusta `localhost:5173` al puerto de tu frontend
   - Estas URLs son donde Mercado Pago redirigirá después del pago

5. Reinicia el servidor Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```

### ¿Dónde se usa?

El Access Token se usa en el backend para:
- Crear preferencias de pago
- Consultar el estado de pagos
- Procesar webhooks de Mercado Pago

---

## 🧪 Pruebas con credenciales de test

### Tarjetas de prueba

Mercado Pago proporciona tarjetas de prueba para simular pagos. **IMPORTANTE:** Usa las tarjetas que aparecen en tu panel de Mercado Pago en la sección "Tarjetas de prueba".

#### ✅ Tarjetas disponibles en tu cuenta (México)

**Opción 1 - Mastercard:**
- **Número:** 4174 0005 1758 0553
- **CVV:** 123
- **Fecha:** 11/30 (cualquier fecha futura)
- **Nombre:** APRO

**Opción 2 - Visa:**
- **Número:** 4075 5957 1648 3764
- **CVV:** 123
- **Fecha:** 11/30 (cualquier fecha futura)
- **Nombre:** APRO

#### ✅ Tarjetas genéricas de prueba (pueden no funcionar con todas las cuentas)
- **Número:** 5031 7557 3453 0604
- **CVV:** 123
- **Fecha:** Cualquier fecha futura
- **Nombre:** APRO (cualquier nombre)

#### ❌ Pago rechazado
- **Número:** 5031 4332 1540 6351
- **CVV:** 123
- **Fecha:** Cualquier fecha futura
- **Nombre:** Cualquier nombre

#### ⏳ Pago pendiente
- **Número:** 5031 7557 3453 0604
- **CVV:** 123
- **Fecha:** Cualquier fecha futura
- **Nombre:** PEND

### Flujo de prueba

1. Ve a http://localhost:5173
2. Selecciona un plan de pensión
3. Completa la información personal
4. Registra un vehículo
5. Click en "Proceder al pago"
6. Serás redirigido a Mercado Pago
7. Usa una tarjeta de prueba
8. Completa el pago
9. Serás redirigido de vuelta a la aplicación
10. Verás la confirmación de registro

---

## 🚀 Producción

### ⚠️ ANTES de ir a producción:

1. **Obtén las credenciales de PRODUCCIÓN:**
   - En el panel de Mercado Pago, cambia a "Credenciales de producción"
   - Copia el nuevo Access Token y Public Key

2. **Actualiza el frontend:**
   ```env
   VITE_MERCADOPAGO_PUBLIC_KEY=APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. **Actualiza el backend:**
   ```properties
   mercadopago.access.token=APP-xxxxxxxxxxxxxxxx...
   mercadopago.public.key=APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   
   # URLs de producción
   mercadopago.success.url=https://tudominio.com/registro-pension?status=approved
   mercadopago.failure.url=https://tudominio.com/registro-pension?status=rejected
   mercadopago.pending.url=https://tudominio.com/registro-pension?status=pending
   ```

4. **Configura webhooks** (opcional pero recomendado):
   - En el panel de Mercado Pago, ve a "Webhooks"
   - Agrega la URL: `https://tudominio.com/api/mercadopago/webhook`
   - Esto te permitirá recibir notificaciones automáticas de pagos

5. **Prueba todo** con tarjetas reales antes de lanzar

---

## 📚 Recursos adicionales

- [Documentación oficial de Mercado Pago](https://www.mercadopago.com.mx/developers/es/docs)
- [Checkout Pro - Guía de integración](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/landing)
- [Tarjetas de prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/test-cards)
- [Webhooks](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/your-integrations/notifications/webhooks)

---

## ❓ Preguntas frecuentes

### ¿Puedo usar las mismas credenciales en frontend y backend?

Sí, pero ten cuidado:
- El **Public Key** se puede usar en ambos lados (es público)
- El **Access Token** SOLO debe estar en el backend (es secreto)

### ¿Qué pasa si alguien ve mi Public Key?

No hay problema, el Public Key está diseñado para ser público. Sin embargo, el Access Token NUNCA debe exponerse.

### ¿Cobran comisión en modo prueba?

No, en modo prueba no se procesan pagos reales ni se cobran comisiones.

### ¿Cuánto cobra Mercado Pago en producción?

Las comisiones varían según el país. En México, aproximadamente:
- 3.59% + $4.00 MXN por transacción con tarjeta de crédito
- [Consulta tarifas actualizadas aquí](https://www.mercadopago.com.mx/ayuda/17858)

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs:**
   - Frontend: Console del navegador (F12)
   - Backend: Terminal donde corre Spring Boot

2. **Verifica las credenciales:**
   - Asegúrate de usar las de PRUEBA en desarrollo
   - Revisa que no tengan espacios extra

3. **Consulta la documentación oficial:**
   - [Centro de ayuda de Mercado Pago](https://www.mercadopago.com.mx/ayuda)

---

✅ **¡Listo!** Con esta configuración, el sistema de pagos de parKing está funcionando.

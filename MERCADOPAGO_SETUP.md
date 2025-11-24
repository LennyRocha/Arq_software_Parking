# Configuración de Mercado Pago para parKing

Este documento explica cómo configurar Mercado Pago tanto en el frontend como en el backend del sistema parKing.

## Configuración del Frontend

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

##  Configuración del Backend

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

### Tarjetas de prueba

#### Tarjetas disponibles

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


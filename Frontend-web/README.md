# parKing - Frontend Web 🚗

Sistema de gestión de estacionamiento con pensiones - Frontend desarrollado con React + Vite.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de interfaz
- **React Router** - Navegación
- **Formik + Yup** - Formularios y validación
- **Axios** - Cliente HTTP
- **SweetAlert2** - Alertas personalizadas
- **Mercado Pago SDK** - Pasarela de pagos

## 📋 Prerequisitos

- Node.js 18+ 
- npm o yarn
- Backend corriendo en `http://localhost:8080`

## 🔧 Instalación

1. **Clonar el repositorio** (si aún no lo has hecho)
   ```bash
   git clone [url-del-repo]
   cd Arq_software_Parking/Frontend-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y agrega tus credenciales de Mercado Pago:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui
   ```

   📚 **Ver guía completa:** [MERCADOPAGO_SETUP.md](../MERCADOPAGO_SETUP.md)

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en: `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes reutilizables globales
│   ├── CustomDialog.jsx
│   ├── HeadingDescription.jsx
│   ├── LoadingBackdrop.jsx
│   └── MainHeader.jsx
├── context/         # Contextos de React
│   └── DarkContext.jsx
├── hooks/           # Custom hooks globales
│   └── useDialogController.js
├── models/          # Modelos y schemas de validación
│   ├── Cajon.js
│   ├── Pension.js
│   ├── User.js
│   ├── Vehicle.js
│   └── yup/        # Schemas de validación Yup
├── modules/         # Módulos de la aplicación
│   ├── LandingPage.jsx
│   ├── RegistroPension.jsx
│   ├── admin/
│   ├── cajon/
│   ├── registro_pension/
│   │   ├── api/
│   │   │   └── registroPensionApi.js
│   │   ├── components/
│   │   │   ├── Step1SeleccionPension.jsx
│   │   │   ├── Step2InformacionPersonal.jsx
│   │   │   ├── Step3InformacionVehiculos.jsx
│   │   │   ├── Step4Pago.jsx
│   │   │   └── Step5Confirmacion.jsx
│   │   ├── config/
│   │   │   └── validationSchemas.js
│   │   └── hooks/
│   │       └── useRegistroPension.js
│   ├── tipo_pension/
│   └── vehiculo/
├── routes/          # Configuración de rutas
│   ├── AdminRouter.jsx
│   ├── EmpleadoRouter.jsx
│   └── ...
├── utils/           # Utilidades y helpers
│   ├── api.js
│   ├── customAlert.js
│   └── getAxiosMessage.js
├── App.jsx
└── main.jsx
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 🎨 Características Principales

### Landing Page
- Muestra planes de pensión disponibles
- Paginación de tipos de pensión
- Diseño responsive
- Modo claro/oscuro
- Sección de preguntas frecuentes

### Registro de Pensión
Proceso de 5 pasos:

1. **Selección de Plan**
   - Carrusel interactivo de planes
   - Carga paginada de opciones
   - Contraste optimizado para modo oscuro

2. **Información Personal**
   - Formulario con validación en tiempo real
   - Campos: nombre, apellidos, correo, teléfono, contraseña
   - Íconos y ayudas visuales

3. **Registro de Vehículos**
   - Lista dinámica (agregar/editar/eliminar)
   - Select de tipos de vehículo desde API
   - Validación de placas

4. **Pago con Mercado Pago**
   - Resumen completo del registro
   - Integración con Checkout Pro
   - Métodos de pago: tarjetas, efectivo, transferencias

5. **Confirmación**
   - Detalles del registro exitoso
   - Información del código QR
   - Redirección a login

### Gestión de Pensiones (Admin)
- CRUD completo de tipos de pensión
- Tabla con filtros y ordenamiento
- Cambio de estado activo/inactivo

### Gestión de Vehículos
- Registro de vehículos
- Tipos de vehículo configurables
- Asociación con usuarios

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:

- Token almacenado en localStorage
- Interceptor Axios para agregar token a requests
- Redirección automática al login si no hay token
- Roles: Admin, Empleado, Cliente

## 🎨 Temas

El sistema incluye modo claro y oscuro:

```jsx
import { useDarkContext } from './context/DarkContext';

const { isDarkMode, toggleDarkMode } = useDarkContext();
```

## 🌐 API Integration

Todas las llamadas a la API están centralizadas en `src/utils/api.js`:

```javascript
import apiToken from '../utils/api';

// GET
const response = await apiToken.get('/endpoint');

// POST
const response = await apiToken.post('/endpoint', data);

// PUT
const response = await apiToken.put('/endpoint', data);

// DELETE
const response = await apiToken.delete('/endpoint');
```

## 💳 Mercado Pago

### Configuración

1. Obtén tus credenciales en [Mercado Pago Developers](https://www.mercadopago.com.mx/developers)
2. Agrega el Public Key en `.env`:
   ```env
   VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
3. Configura el backend con el Access Token (ver [MERCADOPAGO_SETUP.md](../MERCADOPAGO_SETUP.md))

### Tarjetas de Prueba

Para probar pagos en desarrollo:

- **Aprobado:** 5031 7557 3453 0604 / CVV: 123 / Nombre: APRO
- **Rechazado:** 5031 4332 1540 6351 / CVV: 123
- **Pendiente:** 5031 7557 3453 0604 / CVV: 123 / Nombre: PEND

Ver más en: [Tarjetas de prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/test-cards)

## 🚀 Deploy a Producción

1. **Build de producción**
   ```bash
   npm run build
   ```

2. **Actualizar variables de entorno**
   - Cambiar `VITE_API_URL` a la URL de producción
   - Usar credenciales de PRODUCCIÓN de Mercado Pago

3. **Deploy**
   - La carpeta `dist/` contiene los archivos estáticos
   - Puede desplegarse en: Vercel, Netlify, AWS S3, etc.

## 🐛 Troubleshooting

### Error: "Network Error"
- Verifica que el backend esté corriendo
- Revisa la URL en `.env`
- Verifica CORS en el backend

### Error: "Mercado Pago no carga"
- Revisa que el Public Key esté correcto en `.env`
- Verifica que uses credenciales de PRUEBA en desarrollo
- Revisa la consola del navegador para más detalles

### Página en blanco después de build
- Revisa la configuración de `base` en `vite.config.js`
- Verifica que las rutas sean correctas en el deploy

## 📚 Recursos

- [Documentación React](https://react.dev/)
- [Documentación Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Formik](https://formik.org/)
- [Mercado Pago Developers](https://www.mercadopago.com.mx/developers)

## 👥 Equipo

Desarrollado por el equipo de Arquitectura de Software - UTEZ

## 📄 Licencia

Este proyecto es parte de un proyecto académico.


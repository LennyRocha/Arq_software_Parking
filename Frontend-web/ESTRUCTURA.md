# 📁 Estructura del Proyecto - Frontend Web

Este documento explica la organización y estructura del proyecto siguiendo principios de Clean Architecture y modularización.

## 🎯 Descripción General

Este es un proyecto de React + Vite para la gestión de un sistema de estacionamiento. La aplicación permite administrar cajones, vehículos, tarifas, pensiones y control de entrada/salida.

## 📂 Estructura de Carpetas

```
Frontend-web/
├── public/              # Archivos estáticos públicos
├── src/                 # Código fuente principal
│   ├── assets/         # Recursos como imágenes, íconos, etc.
│   ├── components/     # Componentes reutilizables globales
│   ├── context/        # Contextos de React (estado global)
│   ├── hooks/          # Custom hooks reutilizables
│   ├── img/            # Imágenes del proyecto
│   ├── modules/        # Módulos funcionales de la aplicación
│   ├── routes/         # Configuración de rutas y navegación
│   └── utils/          # Utilidades y funciones auxiliares
├── index.html          # Punto de entrada HTML
├── package.json        # Dependencias y scripts
└── vite.config.js      # Configuración de Vite
```

## 📋 Descripción Detallada

### 🧩 `/src/components/`
**Componentes globales reutilizables** que se usan en toda la aplicación.

- `CustomDialog.jsx` - Diálogo personalizado para mostrar información
- `LoadingBackdrop.jsx` - Indicador de carga con overlay
- `MainHeader.jsx` - Cabecera principal de la aplicación
- `CustomTable.jsx` - Tabla reutilizable con ordenamiento y paginación
- `TableFilters.jsx` - Componente de filtros y ordenamiento para tablas
- `CustomSweetAlert.jsx` - Wrapper personalizado de SweetAlert2 para confirmaciones

### 🎨 `/src/context/`
**Contextos de React** para manejar estado global.

- `DarkContext.jsx` - Maneja el modo oscuro/claro de la aplicación

### 🪝 `/src/hooks/`
**Custom hooks** reutilizables.

- `useDialogController.js` - Hook para controlar diálogos


### 🏗️ `/src/modules/`
**Módulos funcionales** de la aplicación. Cada módulo representa una característica específica y sigue su propia estructura interna:

#### Estructura de un módulo:
```
modulo/
├── api/                     # Llamadas a la API del módulo
│   └── moduloApi.js         # Funciones de conexión con el backend
├── components/             # Componentes específicos del módulo
│   ├── ModuloFormModal.jsx  # Modal para crear/editar
│   └── ModuloStatusSwitch.jsx # Componente para cambiar estado
├── config/                 # Configuraciones del módulo
│   ├── moduloYup.js        # Esquema de validación del formulario
│   ├── tableColumns.jsx    # Configuración de columnas para CustomTable y de OrderOptions para TableFilters
├── hooks/                  # Hooks específicos del módulo
│   └── useModulo.js        # Lógica de negocio y estado del módulo
└── pages/                  # Páginas principales del módulo
    └── GestionModulo.jsx   # Página principal del módulo
```


> 💡 **Nota:** Al crear nuevos módulos, sigue esta estructura para mantener la consistencia.

### 🛣️ `/src/routes/`
**Configuración de rutas** según el rol del usuario.

- `AdminRouter.jsx` - Rutas para usuarios administradores
- `EmpleadoRouter.jsx` - Rutas para empleados
- `PensionadoRouter.jsx` - Rutas para usuarios pensionados
- `rutas.jsx` - Configuración general de rutas

### 🔧 `/src/utils/`
**Utilidades y funciones auxiliares** usadas en toda la aplicación.

- `api.js` - Cliente axios sin autenticación
- `apiToken.js` - Cliente axios con token de autenticación
- `AuthService.jsx` - Servicio de autenticación
- `getAxiosMessage.js` - Extrae mensajes de errores de axios
- `getPalette.js` - Obtiene paleta de colores del tema
- `getTheme.js` - Configuración del tema Material-UI
- `sweetAlert.js` - Configuración de alertas SweetAlert2

## 🚀 Primeros Pasos

### 1. Instalación
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Construir para producción
```bash
npm run build
```

## 📝 Convenciones del Proyecto

### ✅ Buenas Prácticas

1. **Componentes globales** → `/src/components/`
2. **Componentes específicos** → `/src/modules/{modulo}/components/`
3. **Hooks reutilizables** → `/src/hooks/`
4. **Hooks específicos** → `/src/modules/{modulo}/hooks/`
6. **Estilos globales** → `App.css` o `index.css`
7. **Estilos de módulo** → `/src/modules/{modulo}/styles/`

### 📦 Organización de Código

- **Un componente por archivo**
- **Nombres en PascalCase** para componentes React
- **Nombres en camelCase** para funciones y variables
- **Nombres descriptivos** que indiquen la función del archivo

## 🔐 Roles de Usuario

La aplicación maneja tres tipos de roles:

1. **Admin** - Acceso completo al sistema
2. **Empleado** - Gestión operativa
3. **Pensionado** - Vista limitada para usuarios con pensión

Cada rol tiene su propio router en `/src/routes/`.

## 🎨 Temas y Estilos

El proyecto usa:
- **Material-UI** para componentes
- **Modo oscuro/claro** mediante `DarkContext`
- **SweetAlert2** para notificaciones
- **CSS modular** para estilos específicos

## 📚 Recursos Adicionales

- **React Documentation:** https://react.dev
- **Vite Documentation:** https://vitejs.dev
- **Material-UI:** https://mui.com
- **React Router:** https://reactrouter.com

## 💡 Consejos para Nuevos Desarrolladores

1. **Empieza explorando** los componentes en `/src/components/`
2. **Examina un módulo completo** (ejemplo: `tipos_pension/`) para ver el patrón
3. **Usa los hooks existentes** antes de crear nuevos
4. **Sigue la estructura** al añadir nuevas funcionalidades
5. **Consulta los routers** para entender el flujo de navegación

---

¿Tienes preguntas? Revisa el código existente como referencia o consulta con el equipo. ¡Bienvenido al proyecto! 🎉

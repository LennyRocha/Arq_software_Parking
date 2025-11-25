# Módulo de Entradas y Salidas

Este módulo maneja la gestión de entradas y salidas de vehículos, tanto para administradores/empleados como para usuarios pensionados.

## Estructura del módulo

```
entradas_salidas/
├── api/
│   ├── EntradaSalidaApi.js          # API para gestión admin de entradas/salidas
│   └── MarcajesUsuario.js           # API para marcajes de pensionados
├── components/
│   ├── AgregarEntradaModal.jsx      # Modal para agregar entrada de visitante
│   ├── EditarEntradaSalidaModal.jsx # Modal para editar entrada
│   ├── ConfirmarSalidaModal.jsx     # Modal de confirmación de salida
│   ├── VerDetalleEntradaSalidaModal.jsx # Modal para ver detalles
│   ├── TarjetaVehiculo.jsx          # Card de vehículo para selección
│   ├── VehiculoEstacionado.jsx      # Vista de vehículo estacionado
│   ├── ReporteFilters.jsx           # Filtros para reportes de ganancias
│   ├── VerDetalleGananciaModal.jsx  # Modal de detalle de ganancia
│   └── VerReportePersonalizadoModal.jsx # Modal de reporte personalizado
├── config/
│   └── tableColumns.jsx             # Configuración de columnas de tablas
├── hooks/
│   ├── useEntradasSalidas.js        # Hook para admin de entradas/salidas
│   ├── useEstacionamientoPensionado.js # Hook para marcajes de pensionados
│   └── useReportesGanancias.js      # Hook para reportes de ganancias
└── pages/
    ├── AdminGestionarEntradasSalidas.jsx    # Página admin/empleado
    ├── AdminGestionarReportesGanancias.jsx  # Página de reportes
    └── PensionadoEstacionamiento.jsx        # Página de estacionamiento pensionados

```

## Funcionalidades

### Para Administradores/Empleados (AdminGestionarEntradasSalidas)
- Consulta paginada de entradas y salidas
- Agregar entrada de visitante
- Editar entrada existente
- Marcar salida de vehículo
- Ver detalles de entrada/salida

### Para Pensionados (PensionadoEstacionamiento)
- Verificar si tiene vehículo estacionado
- Marcar entrada de vehículo propio
- Marcar salida de vehículo propio
- Ver información del vehículo estacionado
- Seleccionar entre vehículos registrados

### Reportes de Ganancias (AdminGestionarReportesGanancias)
- Reporte de ganancias por hora (paginado)
- Reporte personalizado por rango de fechas
- Visualización de totales por tipo (pensiones/visitantes)

## Componentes Reutilizables

### TarjetaVehiculo
Muestra un vehículo con su imagen correspondiente y botón de marcar entrada.

**Props:**
- `vehiculo`: Objeto con datos del vehículo
- `onMarcarEntrada`: Callback al marcar entrada
- `disabled`: Deshabilita el botón

### VehiculoEstacionado
Muestra la información del vehículo actualmente estacionado.

**Props:**
- `vehiculo`: Objeto con datos del vehículo
- `fechaEntrada`: Fecha de entrada
- `horaEntrada`: Hora de entrada
- `folioTicket`: Folio del ticket
- `onMarcarSalida`: Callback al marcar salida
- `disabled`: Deshabilita el botón

## Hooks

### useEstacionamientoPensionado
Maneja el estado y operaciones de estacionamiento para pensionados.

**Estados:**
- `loading`: Indica si hay una operación en curso
- `error`: Mensaje de error si existe
- `tieneVehiculoEstacionado`: Boolean indicando si tiene vehículo estacionado
- `vehiculoEstacionado`: Datos del vehículo estacionado
- `vehiculosDisponibles`: Lista de vehículos del usuario
- `datosEntrada`: Información completa de la entrada actual

**Funciones:**
- `verificarEstacionamiento()`: Verifica estado de estacionamiento
- `cargarVehiculosDisponibles()`: Carga vehículos del usuario
- `marcarEntrada(vehiculoId)`: Marca entrada de vehículo
- `marcarSalida()`: Marca salida de vehículo

## Mapeo de Imágenes de Vehículos

El sistema usa las siguientes imágenes según el tipo de vehículo:

- **idTipoVehiculo = 1**: coche.png (Automóvil)
- **idTipoVehiculo = 2**: moto_view.png (Motocicleta)
- **idTipoVehiculo = 3**: camioneta.png (Camioneta)

Las imágenes se encuentran en: `src/img/`

## API Endpoints

### MarcajesUsuario.js
- `GET /api/vehiculos/estacionado/verificar` - Verifica si usuario tiene vehículo estacionado
- `GET /api/vehiculos/mis-vehiculos` - Obtiene vehículos del pensionado
- `POST /api/entrada-salida/pensionado/entrada` - Marca entrada de vehículo
- `POST /api/entrada-salida/pensionado/salida` - Marca salida de vehículo

## Rutas

- `/pensionados/estacionamiento` - Pantalla de estacionamiento para pensionados
- `/admin` (index) - Gestión de entradas y salidas (admin)
- `/admin/reportes` - Reportes de ganancias
- `/empleado` (index) - Gestión de entradas y salidas (empleado)

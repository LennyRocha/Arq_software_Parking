# Backend Parking - Sistema de Gestión de Estacionamiento

## 📋 Descripción
Sistema backend desarrollado con **Spring Boot 3.5.6** y **Java 17** para la gestión integral de un estacionamiento. Incluye control de entradas/salidas, gestión de pensiones, tarifas, usuarios, vehículos y cajones de estacionamiento.

## 🛠️ Tecnologías Utilizadas
- **Java 17**
- **Spring Boot 3.5.6**
- **Spring Data JPA** - Para persistencia de datos
- **MySQL** - Base de datos
- **Maven** - Gestor de dependencias
- **Swagger/OpenAPI** - Documentación de API
- **Spring DevTools** - Herramientas de desarrollo

## 📊 Base de Datos
- **Motor**: MySQL
- **Base de datos**: `db_parking`
- **Host**: `localhost:3306`
- **JPA**: Actualización automática del esquema (`spring.jpa.hibernate.ddl-auto=update`)

## 📁 Estructura del Proyecto

```
backendparking/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── utez/edu/mx/backendparking/
│   │   │       ├── BackendparkingApplication.java       # Clase principal de Spring Boot
│   │   │       │
│   │   │       ├── config/                              # Configuraciones generales
│   │   │       │   ├── CorsConfig.java                  # Configuración de CORS
│   │   │       │   ├── InitialConfig.java               # Configuración inicial
│   │   │       │   ├── InitialDataService.java          # Servicio de datos iniciales
│   │   │       │   └── OpenApiConfig.java               # Configuración de Swagger/OpenAPI
│   │   │       │
│   │   │       ├── modules/                             # Módulos funcionales del sistema
│   │   │       │   │
│   │   │       │   ├── cajon/                           # Módulo de Cajones de Estacionamiento
│   │   │       │   │   ├── controller/                  # Controladores REST
│   │   │       │   │   ├── model/                       # Entidades JPA
│   │   │       │   │   ├── repository/                  # Repositorios de datos
│   │   │       │   │   ├── service/                     # Lógica de negocio
│   │   │       │   │   ├── validation/                  # Validaciones personalizadas
│   │   │       │   │   └── ws/                          # WebSockets (si aplica)
│   │   │       │   │
│   │   │       │   ├── entradasalida/                   # Módulo de Entradas y Salidas
│   │   │       │   │   ├── dto/                         # Data Transfer Objects
│   │   │       │   │   │   ├── EntradaSalidaCreatePensionadoRequestDto.java
│   │   │       │   │   │   ├── EntradaSalidaCreateVisitanteRequestDto.java
│   │   │       │   │   │   ├── EntradaSalidaResponseDto.java
│   │   │       │   │   │   └── ReporteGananciasResponseDto.java
│   │   │       │   │   ├── EntradaSalida.java           # Entidad principal
│   │   │       │   │   ├── EntradaSalidaController.java # Controlador REST
│   │   │       │   │   ├── EntradaSalidaMapper.java     # Mapper DTO <-> Entidad
│   │   │       │   │   ├── EntradaSalidaMessages.java   # Mensajes de error/éxito
│   │   │       │   │   ├── EntradaSalidaRepository.java # Repositorio JPA
│   │   │       │   │   ├── EntradaSalidaService.java    # Interface de servicio
│   │   │       │   │   └── EntradaSalidaServiceImpl.java # Implementación de servicio
│   │   │       │   │
│   │   │       │   ├── pension/                         # Módulo de Pensiones
│   │   │       │   │   ├── dto/                         # Data Transfer Objects
│   │   │       │   │   │   ├── PensionRequestDto.java
│   │   │       │   │   │   └── PensionResponseDto.java
│   │   │       │   │   ├── Pension.java                 # Entidad principal
│   │   │       │   │   ├── PensionController.java       # Controlador REST
│   │   │       │   │   ├── PensionMapper.java           # Mapper DTO <-> Entidad
│   │   │       │   │   ├── PensionMessages.java         # Mensajes de error/éxito
│   │   │       │   │   ├── PensionRepository.java       # Repositorio JPA
│   │   │       │   │   ├── PensionService.java          # Interface de servicio
│   │   │       │   │   └── PensionServiceImpl.java      # Implementación de servicio
│   │   │       │   │
│   │   │       │   ├── tarifa/                          # Módulo de Tarifas
│   │   │       │   │   ├── dto/                         # Data Transfer Objects
│   │   │       │   │   ├── Tarifa.java                  # Entidad principal
│   │   │       │   │   ├── TarifaController.java        # Controlador REST
│   │   │       │   │   ├── TarifaMapper.java            # Mapper DTO <-> Entidad
│   │   │       │   │   ├── TarifaMessages.java          # Mensajes de error/éxito
│   │   │       │   │   ├── TarifaRepository.java        # Repositorio JPA
│   │   │       │   │   ├── TarifaService.java           # Interface de servicio
│   │   │       │   │   └── TarifaServiceImpl.java       # Implementación de servicio
│   │   │       │   │
│   │   │       │   ├── tipovehiculo/                    # Módulo de Tipos de Vehículo
│   │   │       │   │   ├── controller/                  # Controladores REST
│   │   │       │   │   ├── model/                       # Entidades JPA
│   │   │       │   │   ├── repository/                  # Repositorios de datos
│   │   │       │   │   └── service/                     # Lógica de negocio
│   │   │       │   │
│   │   │       │   ├── usuario/                         # Módulo de Usuarios
│   │   │       │   │   ├── controller/                  # Controladores REST
│   │   │       │   │   ├── model/                       # Entidades JPA (Usuario)
│   │   │       │   │   ├── repository/                  # Repositorios de datos
│   │   │       │   │   └── service/                     # Lógica de negocio
│   │   │       │   │
│   │   │       │   └── vehiculo/                        # Módulo de Vehículos
│   │   │       │       ├── controller/                  # Controladores REST
│   │   │       │       ├── model/                       # Entidades JPA (Vehiculo)
│   │   │       │       ├── repository/                  # Repositorios de datos
│   │   │       │       ├── service/                     # Lógica de negocio
│   │   │       │       └── validation/                  # Validaciones personalizadas
│   │   │       │
│   │   │       └── shared/                              # Componentes compartidos
│   │   │           ├── api/                             # Utilidades de API
│   │   │           │   ├── ApiResponse.java             # Respuesta estándar de API
│   │   │           │   └── GlobalExceptionHandler.java  # Manejador global de excepciones
│   │   │           ├── constants/                       # Constantes del sistema
│   │   │           ├── exception/                       # Excepciones personalizadas
│   │   │           │   ├── BadRequestException.java
│   │   │           │   ├── ConflictException.java
│   │   │           │   └── ResourceNotFoundException.java
│   │   │           ├── util/                            # Utilidades generales
│   │   │           └── webClient/                       # Clientes HTTP/REST
│   │   │
│   │   └── resources/
│   │       └── application.properties                   # Configuración de la aplicación
│   │
│   └── test/
│       └── java/
│           └── utez/edu/mx/backendparking/
│               └── BackendparkingApplicationTests.java  # Tests de integración
│
├── pom.xml                                              # Configuración de Maven
├── mvnw                                                 # Maven Wrapper (Unix)
└── mvnw.cmd                                             # Maven Wrapper (Windows)
```

## 🔍 Descripción de Componentes por Capa

### 📦 Módulos (modules/)
Cada módulo sigue el patrón de arquitectura por capas:

#### **Entidad (Entity)**
- Clase con anotaciones JPA (`@Entity`, `@Table`, etc.)
- Representa la tabla de la base de datos
- Ejemplo: `Pension.java`, `Tarifa.java`, `EntradaSalida.java`

#### **DTOs (Data Transfer Objects)**
- Carpeta `dto/` dentro de cada módulo
- Objetos para transferir datos entre capas
- **RequestDto**: Datos de entrada (peticiones HTTP)
- **ResponseDto**: Datos de salida (respuestas HTTP)

#### **Repository**
- Interface que extiende `JpaRepository`
- Maneja la persistencia de datos
- Métodos de consulta personalizados con `@Query`
- Ejemplo: `PensionRepository.java`

#### **Mapper**
- Clase con métodos estáticos
- Convierte entre DTOs y Entidades
- Ejemplo: `PensionMapper.java`
  - `toEntity(dto)` - Convierte DTO a Entidad
  - `toResponseDto(entity)` - Convierte Entidad a DTO

#### **Messages**
- Clase con constantes de mensajes
- Mensajes de error, éxito y validaciones
- Ejemplo: `PensionMessages.java`, `TarifaMessages.java`

#### **Service (Interface)**
- Define los contratos de métodos de negocio
- Ejemplo: `PensionService.java`

#### **ServiceImpl (Implementación)**
- Implementa la lógica de negocio
- Anotado con `@Service`
- Usa `@Transactional` para transacciones
- Ejemplo: `PensionServiceImpl.java`

#### **Controller**
- Maneja las peticiones HTTP REST
- Anotado con `@RestController` y `@RequestMapping`
- Documentado con anotaciones de OpenAPI (`@Operation`, `@Tag`)
- Ejemplo: `PensionController.java`

### 🔗 Módulos Principales

#### 1️⃣ **EntradaSalida**
Gestiona las entradas y salidas del estacionamiento.

**Funcionalidades:**
- Registro de entrada de pensionados
- Registro de entrada de visitantes
- Cálculo de tarifas para salida de visitantes
- Consulta paginada con búsqueda y ordenamiento
- Reporte de ganancias por hora

**Clases principales:**
- `EntradaSalidaServiceImpl.java`: 
  - `createPensionado()` - Registra entrada de pensionado
  - `createVisitante()` - Registra entrada de visitante
  - `solicitarDatosSalidaVisitante()` - Consulta monto a pagar
  - `marcarSalidaVisitante()` - Registra salida y guarda pago
  - `searchAndSortPaginated()` - Búsqueda paginada
  - `generarReporteGananciasPorHora()` - Reporte de ganancias

#### 2️⃣ **Pension**
Gestiona las pensiones de usuarios registrados.

**Funcionalidades:**
- CRUD de pensiones
- Cambio de estatus de pensiones
- Consultas paginadas

#### 3️⃣ **Tarifa**
Gestiona las tarifas de estacionamiento.

**Funcionalidades:**
- CRUD de tarifas
- Cambio de estatus
- Consultas filtradas por tipo de vehículo y tiempo
- Búsqueda y ordenamiento con paginación

**Clases principales:**
- `TarifaServiceImpl.java`:
  - `create()` - Crea nueva tarifa
  - `changeStatus()` - Activa/desactiva tarifa
  - `update()` - Actualiza tarifa existente
  - `findAllActiveOrderedByVehicleAndTime()` - Consulta tarifas activas
  - `searchAndSortPaginated()` - Búsqueda avanzada paginada

#### 4️⃣ **TipoVehiculo**
Gestiona los tipos de vehículos (Coche, Moto, Camioneta).

#### 5️⃣ **Usuario**
Gestiona los usuarios del sistema (pensionados).

#### 6️⃣ **Vehiculo**
Gestiona los vehículos registrados de los usuarios.

#### 7️⃣ **Cajon**
Gestiona los espacios de estacionamiento.

### ⚙️ Configuración (config/)

- **CorsConfig.java**: Configuración de CORS para permitir peticiones desde frontend
- **InitialConfig.java**: Configuración inicial del sistema
- **InitialDataService.java**: Servicio que inicializa datos por defecto (tipos de vehículo, tarifas, etc.)
- **OpenApiConfig.java**: Configuración de Swagger para documentación de API

### 🛡️ Shared (Componentes Compartidos)

#### **API**
- **ApiResponse.java**: Clase genérica para respuestas HTTP estandarizadas
- **GlobalExceptionHandler.java**: Maneja todas las excepciones del sistema y devuelve respuestas HTTP apropiadas

#### **Exceptions**
- **BadRequestException.java**: Para peticiones inválidas (400)
- **ResourceNotFoundException.java**: Para recursos no encontrados (404)
- **ConflictException.java**: Para conflictos de datos (409)

## 🚀 Ejecución del Proyecto

### Prerrequisitos
- Java 17 instalado
- MySQL en ejecución
- Maven instalado (o usar el wrapper incluido)

### Pasos para ejecutar

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd backendparking
```

2. **Configurar la base de datos**
```sql
CREATE DATABASE db_parking;
```
2.2. **Configurar application.properties para la conexión a la base de datos**
```sql
spring.datasource.url=jdbc:mysql://localhost:{puerto}/db_parking
spring.datasource.username={usuario} "generalmente 'root'"
spring.datasource.password={contraseña} "generalmente 'root'"
```

3. **Ejecutar con Maven (Windows)**
```cmd
mvnw.cmd spring-boot:run
```

3. **Ejecutar con Maven (Unix/Linux/Mac)**
```bash
./mvnw spring-boot:run
```

4. **Acceder a la aplicación**
- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/api-docs`

## 📖 Documentación de API

La documentación interactiva de la API está disponible en:
```
http://localhost:8080/swagger-ui.html
```

Desde aquí puedes:
- Ver todos los endpoints disponibles
- Probar las peticiones directamente
- Ver los esquemas de datos (DTOs)
- Ver códigos de respuesta HTTP

## 🏗️ Patrón de Arquitectura

El proyecto sigue una **arquitectura por capas modular**:

```
Controller (API REST)
    ↓
Service (Lógica de Negocio)
    ↓
Repository (Acceso a Datos)
    ↓
Database (MySQL)
```

### Flujo de una petición típica:

1. **Controller** recibe la petición HTTP
2. **Mapper** convierte el DTO de entrada a Entidad
3. **Service** ejecuta la lógica de negocio
4. **Repository** realiza operaciones en la BD
5. **Mapper** convierte la Entidad a DTO de salida
6. **Controller** devuelve la respuesta HTTP

## 📝 Convenciones de Código

- **Nombres de clases**: PascalCase
- **Nombres de métodos**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Paquetes**: lowercase
- **DTOs**: Sufijo `Dto` (ej: `PensionRequestDto`)
- **Servicios**: Sufijo `Service` o `ServiceImpl`
- **Repositorios**: Sufijo `Repository`
- **Controladores**: Sufijo `Controller`
- **Mappers**: Sufijo `Mapper`

## 📅 Información del Proyecto
---

**Versión**: 0.0.1-SNAPSHOT  
**Última actualización**: 2025-11-08


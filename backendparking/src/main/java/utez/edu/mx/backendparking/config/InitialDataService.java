package utez.edu.mx.backendparking.config;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;
import utez.edu.mx.backendparking.modules.cajon.repository.CajonRepository;
import utez.edu.mx.backendparking.modules.historialpagos.Pago;
import utez.edu.mx.backendparking.modules.historialpagos.PagoRepository;
import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.pension.PensionRepository;
import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.roles.Repository.RolesRepository;
import utez.edu.mx.backendparking.modules.roles.Roles;
import utez.edu.mx.backendparking.modules.tarifa.Tarifa;
import utez.edu.mx.backendparking.modules.tarifa.TarifaRepository;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.repository.TipoVehiculoRepository;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPension;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPensionRepository;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.repository.VehiculoRepository;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class InitialDataService {

    private final TarifaRepository tarifaRepository;
    private final TipoVehiculoRepository tipoVehiculoRepository;
    private final PensionRepository pensionRepository;
    private final RolesRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final VehiculoRepository vehiculoRepository;
    private final UsuarioPensionRepository usuarioPensionRepository;
    private final PagoRepository pagoRepository;
    private final CajonRepository cajonRepository;

    public InitialDataService(TarifaRepository tarifaRepository, TipoVehiculoRepository tipoVehiculoRepository, PensionRepository pensionRepository, RolesRepository roleRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, VehiculoRepository vehiculoRepository, UsuarioPensionRepository usuarioPensionRepository, PagoRepository pagoRepository, CajonRepository cajonRepository) {
        this.tarifaRepository = tarifaRepository;
        this.tipoVehiculoRepository = tipoVehiculoRepository;
        this.pensionRepository = pensionRepository;
        this.roleRepository = roleRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.vehiculoRepository = vehiculoRepository;
        this.usuarioPensionRepository = usuarioPensionRepository;
        this.pagoRepository = pagoRepository;
        this.cajonRepository = cajonRepository;
    }

    @Transactional
    public void inicializarRolesAndUserAdminAndEmployee() {

        // Verificar si ya existen roles
        if (roleRepository.count() == 0) {
            // Crear todos los roles del enum
            for (ERole roleName : ERole.values()) {
                Roles role = new Roles();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }

        // Crear usuario ADMINISTRADOR si no existe
        if (usuarioRepository.findByCorreo("admin@parking.com") == null) {
            Roles rolAdmin = roleRepository.findByName(ERole.ADMINISTRADOR)
                    .orElseThrow(() -> new ResourceNotFoundException("Rol ADMINISTRADOR no encontrado"));

            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setApellidos("Del Sistema");
            admin.setCorreo("admin@parking.com");
            admin.setTelefono("1234567890");
            admin.setContra(passwordEncoder.encode("admin123")); // Contraseña por defecto
            admin.setStatus(true);
            admin.setEsPensionado(false);
            admin.setRol(rolAdmin);

            usuarioRepository.save(admin);
        }

        // Crear usuario EMPLEADO si no existe
        if (usuarioRepository.findByCorreo("empleado@parking.com") == null) {
            Roles rolEmpleado = roleRepository.findByName(ERole.EMPLEADO)
                    .orElseThrow(() -> new RuntimeException("Rol EMPLEADO no encontrado"));

            Usuario empleado = new Usuario();
            empleado.setNombre("Empleado");
            empleado.setApellidos("General");
            empleado.setCorreo("empleado@parking.com");
            empleado.setTelefono("0987654321");
            empleado.setContra(passwordEncoder.encode("empleado123")); // Contraseña por defecto
            empleado.setStatus(true);
            empleado.setEsPensionado(false);
            empleado.setRol(rolEmpleado);

            usuarioRepository.save(empleado);
        }

        // Crear usuario un usuario pensionado si no existe
        if (usuarioRepository.findByCorreo("pensionado@parking.com") == null) {
            Roles rolPensionado = roleRepository.findByName(ERole.CLIENTE_PENSIONADO)
                    .orElseThrow(() -> new RuntimeException("Rol Cliente pensionado no encontrado"));

            Usuario pensionado = new Usuario();
            pensionado.setNombre("Pensionado");
            pensionado.setApellidos("General");
            pensionado.setCorreo("pensionado@parking.com");
            pensionado.setTelefono("7777654321");
            pensionado.setContra(passwordEncoder.encode("pensionado123")); // Contraseña por defecto
            pensionado.setStatus(true);
            pensionado.setEsPensionado(true);
            pensionado.setRol(rolPensionado);

            usuarioRepository.save(pensionado);
        }
    }

    @Transactional
    public void inicializarTiposDeVehiculo() {
        // Verificar si ya existen tipos de vehículo
        if (tipoVehiculoRepository.count() == 0) {
            // Crear los tres tipos de vehículo
            TipoVehiculo coche = new TipoVehiculo( "Coche");
            TipoVehiculo moto = new TipoVehiculo("Camioneta");
            TipoVehiculo camioneta = new TipoVehiculo("Moto");

            // Guardar en la base de datos
            tipoVehiculoRepository.save(coche);
            tipoVehiculoRepository.save(moto);
            tipoVehiculoRepository.save(camioneta);

            System.out.println("Tipos de vehículo inicializados correctamente");
        }
    }

    @Transactional
    public void inicializarTarifas() {
        // Verificar si ya existen tarifas
        if (tarifaRepository.count() == 0) {
            // Obtener los tipos de vehículo
            List<TipoVehiculo> tiposVehiculo = tipoVehiculoRepository.findAll();

            if (tiposVehiculo.isEmpty()) {
                System.out.println("No hay tipos de vehículo. Inicialice primero los tipos de vehículo.");
                return;
            }

            // Crear tarifas para cada tipo de vehículo
            for (TipoVehiculo tipo : tiposVehiculo) {
                // Tarifa por hora (60 minutos)
                Tarifa tarifa1Hora = new Tarifa();
                tarifa1Hora.setTiempo(60);
                tarifa1Hora.setEstatus(true);
                tarifa1Hora.setTipoVehiculo(tipo);

                // Tarifa por 3 horas (180 minutos)
                Tarifa tarifa3Horas = new Tarifa();
                tarifa3Horas.setTiempo(180);
                tarifa3Horas.setEstatus(true);
                tarifa3Horas.setTipoVehiculo(tipo);

                // Tarifa por día (1440 minutos = 24 horas)
                Tarifa tarifaDia = new Tarifa();
                tarifaDia.setTiempo(1440);
                tarifaDia.setEstatus(true);
                tarifaDia.setTipoVehiculo(tipo);

                // Establecer costos según el tipo de vehículo
                if (tipo.getNombre().equalsIgnoreCase("Coche")) {
                    tarifa1Hora.setCosto(20.0);
                    tarifa3Horas.setCosto(50.0);
                    tarifaDia.setCosto(150.0);
                } else if (tipo.getNombre().equalsIgnoreCase("Moto")) {
                    tarifa1Hora.setCosto(10.0);
                    tarifa3Horas.setCosto(25.0);
                    tarifaDia.setCosto(80.0);
                } else if (tipo.getNombre().equalsIgnoreCase("Camioneta")) {
                    tarifa1Hora.setCosto(30.0);
                    tarifa3Horas.setCosto(75.0);
                    tarifaDia.setCosto(200.0);
                } else {
                    // Tarifas por defecto para otros tipos
                    tarifa1Hora.setCosto(15.0);
                    tarifa3Horas.setCosto(40.0);
                    tarifaDia.setCosto(120.0);
                }

                // Guardar las tarifas
                tarifaRepository.save(tarifa1Hora);
                tarifaRepository.save(tarifa3Horas);
                tarifaRepository.save(tarifaDia);
            }

            System.out.println("Tarifas inicializadas correctamente");
        }
    }

    @Transactional
    public void inicializarPensiones() {
        if (pensionRepository.count() == 0) {


            Pension p1 = new Pension();
            p1.setNombre("Pensión Semanal");
            p1.setDuracionDias(7);
            p1.setCosto(500.0);
            p1.setStatus(true);

            Pension p2 = new Pension();
            p2.setNombre("Pensión Quincena");
            p2.setDuracionDias(15);
            p2.setCosto(800.0);
            p2.setStatus(true);

            Pension p3 = new Pension();
            p3.setNombre("Pensión Mensual");
            p3.setDuracionDias(30);
            p3.setCosto(1500.0);
            p3.setStatus(true);

            // Pensiones para Moto
            Pension p4 = new Pension();
            p4.setNombre("Pensión Trimestral");
            p4.setDuracionDias(90);
            p4.setCosto(2500.0);
            p4.setStatus(true);


            // Guardar todos
            pensionRepository.save(p1);
            pensionRepository.save(p2);
            pensionRepository.save(p3);
            pensionRepository.save(p4);
        }
    }

    @Transactional
    public void inicializarVehiculos() {
        // Buscar el usuario pensionado
        Usuario pensionado = usuarioRepository.findByCorreo("pensionado@parking.com");

        if (pensionado == null) {
            System.out.println("No se encontró el usuario pensionado. Inicialice primero los usuarios.");
            return;
        }

        // Verificar si el usuario ya tiene vehículos
        List<Vehiculo> vehiculosExistentes = vehiculoRepository.findByUsuarioId(pensionado.getId());
        if (!vehiculosExistentes.isEmpty()) {
            System.out.println("El usuario pensionado ya tiene vehículos registrados.");
            return;
        }

        // Obtener tipos de vehículo
        List<TipoVehiculo> tiposVehiculo = tipoVehiculoRepository.findAll();
        if (tiposVehiculo.isEmpty()) {
            System.out.println("No hay tipos de vehículo. Inicialice primero los tipos de vehículo.");
            return;
        }

        // Buscar tipo Coche y Moto
        TipoVehiculo tipoCoche = tiposVehiculo.stream()
                .filter(t -> t.getNombre().equalsIgnoreCase("Coche"))
                .findFirst()
                .orElse(tiposVehiculo.get(0));

        TipoVehiculo tipoMoto = tiposVehiculo.stream()
                .filter(t -> t.getNombre().equalsIgnoreCase("Moto"))
                .findFirst()
                .orElse(tiposVehiculo.size() > 1 ? tiposVehiculo.get(1) : tiposVehiculo.get(0));

        // Crear primer vehículo - Coche
        Vehiculo vehiculo1 = new Vehiculo();
        vehiculo1.setPlaca("yyy-123");
        vehiculo1.setModelo("Honda Civic 2020");
        vehiculo1.setDescripcion("Sedán gris plata");
        vehiculo1.setEstatus(true);
        vehiculo1.setTipoVehiculo(tipoCoche);
        vehiculo1.setUsuario(pensionado);

        // Crear segundo vehículo - Moto
        Vehiculo vehiculo2 = new Vehiculo();
        vehiculo2.setPlaca("zzz-789");
        vehiculo2.setModelo("Yamaha MT-07 2021");
        vehiculo2.setDescripcion("Motocicleta deportiva azul");
        vehiculo2.setEstatus(true);
        vehiculo2.setTipoVehiculo(tipoMoto);
        vehiculo2.setUsuario(pensionado);

        // Guardar vehículos
        vehiculoRepository.save(vehiculo1);
        vehiculoRepository.save(vehiculo2);

        System.out.println("Vehículos inicializados correctamente para el usuario pensionado.");
    }

    @Transactional
    public void inicializarUsuarioPension() {
        // Buscar el usuario pensionado
        Usuario pensionado = usuarioRepository.findByCorreo("pensionado@parking.com");

        if (pensionado == null) {
            System.out.println("No se encontró el usuario pensionado. Inicialice primero los usuarios.");
            return;
        }

        // Verificar si el usuario ya tiene una pensión asignada
        if (usuarioPensionRepository.findByUsuarioIdAndEstatusTrue(pensionado.getId()).isPresent()) {
            System.out.println("El usuario pensionado ya tiene una pensión activa.");
            return;
        }

        // Obtener las pensiones disponibles
        List<Pension> pensiones = pensionRepository.findAll();
        if (pensiones.isEmpty()) {
            System.out.println("No hay pensiones disponibles. Inicialice primero las pensiones.");
            return;
        }

        // Seleccionar la pensión "Pensión Semanal"  o la primera disponible
        Pension pensionSeleccionada = pensiones.stream()
                .filter(p -> p.getNombre().equalsIgnoreCase("Pensión Semanal"))
                .findFirst()
                .orElse(pensiones.get(0));

        // Crear el registro de usuario_pension
        UsuarioPension usuarioPension = new UsuarioPension();
        usuarioPension.setUsuario(pensionado);
        usuarioPension.setPension(pensionSeleccionada);
        usuarioPension.setEstatus(true);

        // Calcular fecha de finalización (hoy + duración de la pensión)
        LocalDate fechaFinalizacion = LocalDate.now().plusDays(pensionSeleccionada.getDuracionDias());
        usuarioPension.setFechaFinalizacion(fechaFinalizacion);

        // Generar código QR único (usando el mismo metodo que el servicio de entrada/salida)
        String uuidCodigoQR = generarUuidUnico();
        usuarioPension.setUuidCodigoQR(uuidCodigoQR);

        // No asignamos ultima entrada (se quedará en null)
        usuarioPension.setUltimaEntradaSalida(null);

        // Guardar el registro
        usuarioPensionRepository.save(usuarioPension);

        Pago pago=new Pago();
        pago.setCantidadPago(pensionSeleccionada.getCosto());
        pago.setUsuarioPension(usuarioPension);
        pago.setFechaPago(LocalDate.now());
        pago.setHoraPago(LocalTime.now());
        pago.setFechaInicio(LocalDate.now());
        pago.setFechaFin(LocalDate.now().plusDays(pensionSeleccionada.getDuracionDias()));
        pago.setPension(pensionSeleccionada);
        pagoRepository.save(pago);

        System.out.println("Usuario pensión inicializado correctamente.");
        System.out.println("Pensión asignada: " + pensionSeleccionada.getNombre());
        System.out.println("Fecha de finalización: " + fechaFinalizacion);
        System.out.println("Código QR: " + uuidCodigoQR);
    }

    /**
     * Metodo privado para generar UUID único para código QR
     * (mismo metodo que en EntradaSalidaServiceImpl)
     */
    private String generarUuidUnico() {
        String uuid;
        do {
            uuid = UUID.randomUUID().toString();
        } while (usuarioPensionRepository.existsByUuidCodigoQR(uuid));
        return uuid;
    }

    /**
     * Metodo para crear los cajones del estacionamiento
     */
    @Transactional
    public void inicializarCajones() {

        // Verificar si ya existen cajones
        if (cajonRepository.count() > 0) {
            System.out.println("Los cajones ya fueron inicializados previamente.");
            return;
        }

        // Obtener tipos de vehículo
        List<TipoVehiculo> tipos = tipoVehiculoRepository.findAll();
        if (tipos.isEmpty()) {
            System.out.println("No hay tipos de vehículo. Inicialice primero Tipos de Vehículo.");
            return;
        }

        TipoVehiculo coche = tipos.stream()
                .filter(t -> t.getNombre().equalsIgnoreCase("Coche"))
                .findFirst().orElse(null);

        TipoVehiculo moto = tipos.stream()
                .filter(t -> t.getNombre().equalsIgnoreCase("Moto"))
                .findFirst().orElse(null);

        TipoVehiculo camioneta = tipos.stream()
                .filter(t -> t.getNombre().equalsIgnoreCase("Camioneta"))
                .findFirst().orElse(null);

        // Crear cajones de ejemplo
        Cajon c1 = new Cajon(null, "A1", "Cerca de entrada principal", true, false, 1, true, coche);
        c1.setTipoVehiculo(coche);

        Cajon c2 = new Cajon(null, "A2", "Zona media del piso 1", true, false, 1, true, coche);
        c2.setTipoVehiculo(coche);

        Cajon c3 = new Cajon(null, "M1", "Cerca de escalera piso 2", true, false, 2, true, coche);
        c3.setTipoVehiculo(moto);

        Cajon c4 = new Cajon(null, "C1", "Zona amplia piso 1", true, true, 1, true, camioneta);
        c4.setTipoVehiculo(camioneta);

        Cajon c5 = new Cajon(null, "B1", "Zona amplia piso 2", true, false, 2, true, camioneta);
        c4.setTipoVehiculo(camioneta);

        Cajon c6 = new Cajon(null, "C4", "Zona amplia piso 3", true, false, 3, true, camioneta);
        c4.setTipoVehiculo(camioneta);

        Cajon c7 = new Cajon(null, "C2", "Cerca de la entrada trasera", true, true, 1, true, moto);
        c4.setTipoVehiculo(camioneta);

        Cajon c8 = new Cajon(null, "M2", "Zona amplia piso 1, a la izquierda", true, false, 1, true, moto);
        c4.setTipoVehiculo(camioneta);

        Cajon c9 = new Cajon(null, "A3", "Zona media del piso 1", true, false, 1, true, coche);
        c9.setTipoVehiculo(coche);

        Cajon c10 = new Cajon(null, "A4", "Cerca de salida piso 1", true, false, 1, true, coche);
        c10.setTipoVehiculo(coche);

        Cajon c11 = new Cajon(null, "B2", "Zona izquierda piso 2", true, false, 2, true, coche);
        c11.setTipoVehiculo(coche);

        Cajon c12 = new Cajon(null, "B3", "Zona derecha piso 2", true, false, 2, true, coche);
        c12.setTipoVehiculo(coche);

        Cajon c13 = new Cajon(null, "M3", "Cerca de elevador piso 1", true, false, 1, true, moto);
        c13.setTipoVehiculo(moto);

        Cajon c14 = new Cajon(null, "M4", "Zona lateral piso 2", true, false, 2, true, moto);
        c14.setTipoVehiculo(moto);

        Cajon c15 = new Cajon(null, "C3", "Zona amplia piso 3", true, false, 3, true, camioneta);
        c15.setTipoVehiculo(camioneta);

        Cajon c16 = new Cajon(null, "C5", "Cerca de salida piso 3", true, false, 3, true, camioneta);
        c16.setTipoVehiculo(camioneta);

        Cajon c17 = new Cajon(null, "D1", "Zona premium piso 1", true, true, 1, true, coche);
        c17.setTipoVehiculo(coche);

        Cajon c18 = new Cajon(null, "D2", "Zona premium piso 2", true, true, 2, true, coche);
        c18.setTipoVehiculo(coche);

        Cajon c19 = new Cajon(null, "E1", "Cerca de ascensor piso 1", true, false, 1, true, coche);
        c19.setTipoVehiculo(coche);

        Cajon c20 = new Cajon(null, "E2", "Zona media piso 2", true, false, 2, true, coche);
        c20.setTipoVehiculo(coche);

        Cajon c21 = new Cajon(null, "M5", "Zona lateral piso 3", true, false, 3, true, moto);
        c21.setTipoVehiculo(moto);

        Cajon c22 = new Cajon(null, "M6", "Cerca de escalera piso 3", true, false, 3, true, moto);
        c22.setTipoVehiculo(moto);

        Cajon c23 = new Cajon(null, "C6", "Zona amplia piso 2", true, true, 2, true, camioneta);
        c23.setTipoVehiculo(camioneta);

        Cajon c24 = new Cajon(null, "C7", "Cerca de entrada piso 1", true, true, 1, true, camioneta);
        c24.setTipoVehiculo(camioneta);


        // Guardar
        cajonRepository.save(c1);
        cajonRepository.save(c2);
        cajonRepository.save(c3);
        cajonRepository.save(c4);
        cajonRepository.save(c5);
        cajonRepository.save(c6);
        cajonRepository.save(c7);
        cajonRepository.save(c8);
        cajonRepository.save(c9);
        cajonRepository.save(c10);
        cajonRepository.save(c11);
        cajonRepository.save(c12);
        cajonRepository.save(c13);
        cajonRepository.save(c14);
        cajonRepository.save(c15);
        cajonRepository.save(c16);
        cajonRepository.save(c17);
        cajonRepository.save(c18);
        cajonRepository.save(c19);
        cajonRepository.save(c20);
        cajonRepository.save(c21);
        cajonRepository.save(c22);
        cajonRepository.save(c23);
        cajonRepository.save(c24);


        System.out.println("Cajones inicializados exitosamente");
    }
}

package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Repository
public interface EntradaSalidaRepository extends JpaRepository<EntradaSalida, Long> {
    boolean existsByFolioTicket(Integer folioTicket);
    Optional<EntradaSalida> findByFolioTicket(Integer folioTicket);

    @Query("""
           SELECT DISTINCT e FROM EntradaSalida e LEFT JOIN e.usuario u 
           WHERE :search IS NULL OR :search = '' OR 
           CAST(e.folioTicket AS string) LIKE CONCAT('%', :search, '%')
           """)
    Page<EntradaSalida> findByFolioOrUsuarioNombre(@Param("search") String search, Pageable pageable);

    @Query("""
           SELECT DISTINCT e FROM EntradaSalida e LEFT JOIN e.usuario u
           WHERE (:search IS NULL OR :search = '' OR CAST(e.folioTicket AS string) LIKE CONCAT('%', :search, '%'))
           AND e.usuario.id = :usuarioId
           """)
    Page<EntradaSalida> findByUsuarioIdAndFolioOrUsuarioNombre(@Param("search") String search, @Param("usuarioId") Long usuarioId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.cantidadPago), 0.0) FROM EntradaSalida e " +
           "WHERE e.usuario IS NULL " +
           "AND e.fecha = :fecha " +
           "AND e.horaSalida >= :horaInicio " +
           "AND e.horaSalida < :horaFin " +
           "AND e.cantidadPago IS NOT NULL")
    Double calcularGananciasVisitantesPorHora(
        @Param("fecha") LocalDate fecha,
        @Param("horaInicio") LocalTime horaInicio,
        @Param("horaFin") LocalTime horaFin
    );

    @Query(value = """
        SELECT 
            fecha_hora.fecha as fecha,
            fecha_hora.hora as hora,
            COALESCE(SUM(CASE WHEN es.id_usuario IS NULL THEN es.cantidad_pago ELSE 0 END), 0) as gananciasVisitantes
        FROM (
            SELECT DISTINCT 
                es.fecha as fecha,
                EXTRACT(HOUR FROM es.hora_salida) as hora
            FROM entrada_salida es
            WHERE es.fecha BETWEEN :fechaInicial AND :fechaFinal
                AND es.hora_salida IS NOT NULL
        ) fecha_hora
        LEFT JOIN entrada_salida es 
            ON es.fecha = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM es.hora_salida) = fecha_hora.hora
            AND es.cantidad_pago IS NOT NULL
        GROUP BY fecha_hora.fecha, fecha_hora.hora
        ORDER BY fecha_hora.fecha DESC, fecha_hora.hora DESC
        """,
        nativeQuery = true)
    Page<Object[]> findReporteGananciasPorHoraDesc(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal,
        Pageable pageable
    );

    @Query(value = """
        SELECT 
            fecha_hora.fecha as fecha,
            fecha_hora.hora as hora,
            COALESCE(SUM(CASE WHEN es.id_usuario IS NULL THEN es.cantidad_pago ELSE 0 END), 0) as gananciasVisitantes
        FROM (
            SELECT DISTINCT 
                es.fecha as fecha,
                EXTRACT(HOUR FROM es.hora_salida) as hora
            FROM entrada_salida es
            WHERE es.fecha BETWEEN :fechaInicial AND :fechaFinal
                AND es.hora_salida IS NOT NULL
        ) fecha_hora
        LEFT JOIN entrada_salida es 
            ON es.fecha = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM es.hora_salida) = fecha_hora.hora
            AND es.cantidad_pago IS NOT NULL
        GROUP BY fecha_hora.fecha, fecha_hora.hora
        ORDER BY fecha_hora.fecha ASC, fecha_hora.hora ASC
        """,
        nativeQuery = true)
    Page<Object[]> findReporteGananciasPorHoraAsc(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal,
        Pageable pageable
    );

    @Query("SELECT MIN(e.fecha) FROM EntradaSalida e")
    LocalDate findMinFecha();

    @Query("SELECT MAX(e.fecha) FROM EntradaSalida e")
    LocalDate findMaxFecha();

    @Query(value = """
        SELECT 
            COALESCE(SUM(CASE WHEN es.id_usuario IS NULL THEN es.cantidad_pago ELSE 0 END), 0) as gananciasVisitantes
        FROM entrada_salida es
        WHERE es.fecha BETWEEN :fechaInicial AND :fechaFinal
            AND es.hora_salida IS NOT NULL
            AND es.cantidad_pago IS NOT NULL
        """,
        nativeQuery = true)
    Double findReporteGananciasTotales(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal
    );

    @Query(value = """
        SELECT 
            fecha_hora.fecha as fecha,
            fecha_hora.hora as hora,
            COALESCE(SUM(CASE WHEN es.id_usuario IS NULL THEN es.cantidad_pago ELSE 0 END), 0) as gananciasVisitantes,
            COALESCE(SUM(p.cantidad_pago), 0) as gananciasPensionados
        FROM (
            SELECT fecha, hora FROM (
                SELECT DISTINCT 
                    es.fecha as fecha,
                    EXTRACT(HOUR FROM es.hora_salida) as hora
                FROM entrada_salida es
                WHERE es.fecha BETWEEN :fechaInicial AND :fechaFinal
                    AND es.hora_salida IS NOT NULL
                UNION
                SELECT DISTINCT 
                    p.fecha_pago as fecha,
                    EXTRACT(HOUR FROM p.hora_pago) as hora
                FROM pago p
                WHERE p.fecha_pago BETWEEN :fechaInicial AND :fechaFinal
                    AND p.hora_pago IS NOT NULL
            ) combinado
        ) fecha_hora
        LEFT JOIN entrada_salida es 
            ON es.fecha = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM es.hora_salida) = fecha_hora.hora
            AND es.cantidad_pago IS NOT NULL
        LEFT JOIN pago p 
            ON p.fecha_pago = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM p.hora_pago) = fecha_hora.hora
            AND p.cantidad_pago IS NOT NULL
        GROUP BY fecha_hora.fecha, fecha_hora.hora
        ORDER BY fecha_hora.fecha DESC, fecha_hora.hora DESC
        """,
        nativeQuery = true)
    Page<Object[]> findReporteGananciasCombinadasPorHoraDesc(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal,
        Pageable pageable
    );

    @Query(value = """
        SELECT 
            fecha_hora.fecha as fecha,
            fecha_hora.hora as hora,
            COALESCE(SUM(CASE WHEN es.id_usuario IS NULL THEN es.cantidad_pago ELSE 0 END), 0) as gananciasVisitantes,
            COALESCE(SUM(p.cantidad_pago), 0) as gananciasPensionados
        FROM (
            SELECT fecha, hora FROM (
                SELECT DISTINCT 
                    es.fecha as fecha,
                    EXTRACT(HOUR FROM es.hora_salida) as hora
                FROM entrada_salida es
                WHERE es.fecha BETWEEN :fechaInicial AND :fechaFinal
                    AND es.hora_salida IS NOT NULL
                UNION
                SELECT DISTINCT 
                    p.fecha_pago as fecha,
                    EXTRACT(HOUR FROM p.hora_pago) as hora
                FROM pago p
                WHERE p.fecha_pago BETWEEN :fechaInicial AND :fechaFinal
                    AND p.hora_pago IS NOT NULL
            ) combinado
        ) fecha_hora
        LEFT JOIN entrada_salida es 
            ON es.fecha = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM es.hora_salida) = fecha_hora.hora
            AND es.cantidad_pago IS NOT NULL
        LEFT JOIN pago p 
            ON p.fecha_pago = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM p.hora_pago) = fecha_hora.hora
            AND p.cantidad_pago IS NOT NULL
        GROUP BY fecha_hora.fecha, fecha_hora.hora
        ORDER BY fecha_hora.fecha ASC, fecha_hora.hora ASC
        """,
        nativeQuery = true)
    Page<Object[]> findReporteGananciasCombinadasPorHoraAsc(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal,
        Pageable pageable
    );

}

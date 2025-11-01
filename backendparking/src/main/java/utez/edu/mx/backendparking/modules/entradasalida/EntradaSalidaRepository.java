package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EntradaSalidaRepository extends JpaRepository<EntradaSalida, Long> {
    boolean existsByFolioTicket(Integer folioTicket);
    Optional<EntradaSalida> findByFolioTicket(Integer folioTicket);

    /*
    @Query("""
           SELECT DISTINCT e FROM EntradaSalida e LEFT JOIN e.usuario u 
           WHERE :search IS NULL OR :search = '' OR 
           CAST(e.folioTicket AS string) LIKE CONCAT('%', :search, '%') OR 
           LOWER(CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellidoPaterno, ''), ' ', COALESCE(u.apellidoMaterno, ''))) LIKE LOWER(CONCAT('%', :search, '%'))
           """)
    Page<EntradaSalida> findByFolioOrUsuarioNombre(@Param("search") String search, Pageable pageable);

     */
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
            COALESCE(SUM(CASE WHEN es.id_usuario IS NULL THEN es.cantidad_pago ELSE 0 END), 0) as gananciasVisitantes,
            0.0 as gananciasPensionados
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
            COALESCE(SUM(CASE WHEN es.id_usuario IS NULL THEN es.cantidad_pago ELSE 0 END), 0) as gananciasVisitantes,
            0.0 as gananciasPensionados
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
}

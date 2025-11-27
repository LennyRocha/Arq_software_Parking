package utez.edu.mx.backendparking.modules.historialpagos;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    @Query(value = """
        SELECT 
            fecha_hora.fecha as fecha,
            fecha_hora.hora as hora,
            COALESCE(SUM(p.cantidad_pago), 0) as gananciasPensionados
        FROM (
            SELECT DISTINCT 
                p.fecha_pago as fecha,
                EXTRACT(HOUR FROM p.hora_pago) as hora
            FROM pago p
            WHERE p.fecha_pago BETWEEN :fechaInicial AND :fechaFinal
                AND p.hora_pago IS NOT NULL
        ) fecha_hora
        LEFT JOIN pago p 
            ON p.fecha_pago = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM p.hora_pago) = fecha_hora.hora
            AND p.cantidad_pago IS NOT NULL
        GROUP BY fecha_hora.fecha, fecha_hora.hora
        ORDER BY fecha_hora.fecha DESC, fecha_hora.hora DESC
        """,
        nativeQuery = true)
    Page<Object[]> findGananciasPensionadosPorHoraDesc(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal,
        Pageable pageable
    );

    @Query(value = """
        SELECT 
            fecha_hora.fecha as fecha,
            fecha_hora.hora as hora,
            COALESCE(SUM(p.cantidad_pago), 0) as gananciasPensionados
        FROM (
            SELECT DISTINCT 
                p.fecha_pago as fecha,
                EXTRACT(HOUR FROM p.hora_pago) as hora
            FROM pago p
            WHERE p.fecha_pago BETWEEN :fechaInicial AND :fechaFinal
                AND p.hora_pago IS NOT NULL
        ) fecha_hora
        LEFT JOIN pago p 
            ON p.fecha_pago = fecha_hora.fecha 
            AND EXTRACT(HOUR FROM p.hora_pago) = fecha_hora.hora
            AND p.cantidad_pago IS NOT NULL
        GROUP BY fecha_hora.fecha, fecha_hora.hora
        ORDER BY fecha_hora.fecha ASC, fecha_hora.hora ASC
        """,
        nativeQuery = true)
    Page<Object[]> findGananciasPensionadosPorHoraAsc(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal,
        Pageable pageable
    );

    @Query(value = """
        SELECT 
            COALESCE(SUM(p.cantidad_pago), 0) as gananciasPensionados
        FROM pago p
        WHERE p.fecha_pago BETWEEN :fechaInicial AND :fechaFinal
        """,
        nativeQuery = true)
    Double findGananciasPensionadosTotales(
        @Param("fechaInicial") LocalDate fechaInicial,
        @Param("fechaFinal") LocalDate fechaFinal
    );

    @Query("SELECT p FROM Pago p WHERE p.usuarioPension.id = :usuarioPensionId")
    Page<Pago> findByUsuarioPensionId(@Param("usuarioPensionId") Long usuarioPensionId, Pageable pageable);

    @Query("""
        SELECT p FROM Pago p 
        WHERE p.usuarioPension.id = :usuarioPensionId 
        AND p.fechaFin = :fechaFinalizacion 
        ORDER BY p.fechaPago DESC 
        LIMIT 1
        """)
    Optional<Pago> findUltimoPagoPorFechaFinalizacion(@Param("usuarioPensionId") Long usuarioPensionId, @Param("fechaFinalizacion") LocalDate fechaFinalizacion);

    @Query("""
        SELECT p FROM Pago p 
        WHERE p.usuarioPension.id = :usuarioPensionId 
        AND p.fechaInicio > :fechaFinalizacion
        """)
    Optional<Pago> findPagoRenovacionPosterior(@Param("usuarioPensionId") Long usuarioPensionId, @Param("fechaFinalizacion") LocalDate fechaFinalizacion);

    Optional<Pago> findFirstByUsuarioPensionIdAndFechaInicioAfterOrderByFechaInicio(Long usuarioPensionId, LocalDate fechaInicio);

    @Query("SELECT p FROM Pago p WHERE p.usuarioPension.id = :usuarioPensionId")
    List<Pago> findAllByUsuarioPensionId(@Param("usuarioPensionId") Long usuarioPensionId);

    @Query("SELECT p FROM Pago p WHERE p.usuarioPension.id = :usuarioPensionId " +
            "AND p.fechaInicio > :fechaFinalizacionAnterior " +
            "AND p.fechaInicio >= :fechaActual " +  // ← NUEVA CONDICIÓN
            "ORDER BY p.fechaInicio ASC")
    Optional<Pago> findPagoFuturoValido(@Param("usuarioPensionId") Long usuarioPensionId,
                                        @Param("fechaFinalizacionAnterior") LocalDate fechaFinalizacionAnterior,
                                        @Param("fechaActual") LocalDate fechaActual);

    @Query("SELECT MAX(p.fechaFin) FROM Pago p WHERE p.usuarioPension.id = :usuarioPensionId AND p.fechaInicio > :fechaActual")
    Optional<LocalDate> findMaxFechaFinFutura(@Param("usuarioPensionId") Long usuarioPensionId,
                                              @Param("fechaActual") LocalDate fechaActual);
}

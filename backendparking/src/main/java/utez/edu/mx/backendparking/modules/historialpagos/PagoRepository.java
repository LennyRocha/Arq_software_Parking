package utez.edu.mx.backendparking.modules.historialpagos;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    @Query(value = """
        SELECT 
            fecha_hora.fecha as fecha,
            fecha_hora.hora as hora,
            COALESCE(SUM(p.cantidad_pago), 0) as gananciasPensionados
        FROM (
            SELECT DISTINCT 
                es.fecha as fecha,
                EXTRACT(HOUR FROM es.hora_salida) as hora
            FROM entrada_salida es
            WHERE es.fecha BETWEEN :fechaInicial AND :fechaFinal
                AND es.hora_salida IS NOT NULL
        ) fecha_hora
        LEFT JOIN pago p 
            ON p.fecha_pago = fecha_hora.fecha
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
                es.fecha as fecha,
                EXTRACT(HOUR FROM es.hora_salida) as hora
            FROM entrada_salida es
            WHERE es.fecha BETWEEN :fechaInicial AND :fechaFinal
                AND es.hora_salida IS NOT NULL
        ) fecha_hora
        LEFT JOIN pago p 
            ON p.fecha_pago = fecha_hora.fecha
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

}

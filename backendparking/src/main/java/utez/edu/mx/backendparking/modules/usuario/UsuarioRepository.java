package utez.edu.mx.backendparking.modules.usuario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByCorreo(String Correo);

    boolean existsByCorreo(String correo);

    // Búsqueda paginada por nombre, apellidos o correo (todos los usuarios)
    @Query("SELECT u FROM Usuario u WHERE " +
           "(LOWER(u.nombre) LIKE :searchTerm OR " +
           "LOWER(u.apellidos) LIKE :searchTerm OR " +
           "LOWER(u.correo) LIKE :searchTerm)")
    Page<Usuario> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Búsqueda paginada filtrada por tipo de usuario (pensionado/empleado)
    @Query("SELECT u FROM Usuario u WHERE " +
           "u.esPensionado = :esPensionado AND " +
           "(LOWER(u.nombre) LIKE :searchTerm OR " +
           "LOWER(u.apellidos) LIKE :searchTerm OR " +
           "LOWER(u.correo) LIKE :searchTerm)")
    Page<Usuario> findBySearchTermAndEsPensionado(@Param("searchTerm") String searchTerm, 
                                                    @Param("esPensionado") boolean esPensionado, 
                                                    Pageable pageable);

    // Todos los usuarios paginados filtrados por tipo
    Page<Usuario> findByEsPensionado(boolean esPensionado, Pageable pageable);
} 
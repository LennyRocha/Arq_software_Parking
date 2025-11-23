package utez.edu.mx.backendparking.modules.roles.Repository;

import org.springframework.stereotype.Repository;

import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.roles.Roles;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<Roles, Long> {

    Optional<Roles> findByName(ERole name);
    
} 
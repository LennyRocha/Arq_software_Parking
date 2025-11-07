package utez.edu.mx.backendparking.modules.usuario.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

}

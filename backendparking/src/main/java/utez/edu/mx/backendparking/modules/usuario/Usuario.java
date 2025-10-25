package utez.edu.mx.backendparking.modules.usuario;


import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}

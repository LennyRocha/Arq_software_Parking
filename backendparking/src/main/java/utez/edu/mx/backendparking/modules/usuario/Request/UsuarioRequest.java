package utez.edu.mx.backendparking.modules.usuario.Request;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioRequest {
    private String nombre;
    private String correo;
    private String contra;
    private String telefono;
    private String apellidos;
    private String status;
}

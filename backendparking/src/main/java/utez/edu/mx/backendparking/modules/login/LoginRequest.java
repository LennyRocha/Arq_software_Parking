package utez.edu.mx.backendparking.modules.login;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequest {
     private String correo;
    private String contra;

}

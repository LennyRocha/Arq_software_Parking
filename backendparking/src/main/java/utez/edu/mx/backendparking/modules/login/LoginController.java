package utez.edu.mx.backendparking.modules.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api")
public class LoginController {
    
    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginRequest loginRequest) {
        ApiResponse<?> response = loginService.Login(
            loginRequest.getCorreo(), 
            loginRequest.getContra()
        );
        
        return ResponseEntity
            .status(response.getStatus())
            .body(response);
    }
}
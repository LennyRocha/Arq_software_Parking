package utez.edu.mx.backendparking.modules.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;
import org.modelmapper.ModelMapper;

import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.usuario.repository.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuario.Request.UsuarioRequest;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;
import utez.edu.mx.backendparking.modules.roles.Roles;
import utez.edu.mx.backendparking.modules.roles.Repository.RolesRepository;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    private static final Logger log = Logger.getLogger(UsuarioServiceImpl.class.getName());

    @Autowired
    private UsuarioRepository  usuarioRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;
//METODO PARA CREAR USUARIO CLIENTE
    @Override
public ApiResponse<?> createUser(UsuarioRequest request){
   try{
      Usuario usuarioExistente = usuarioRepository.findByCorreo(request.getCorreo());
      if(usuarioExistente != null){
          return ApiResponse.error(
              HttpStatus.BAD_REQUEST,
              "El usuario ya existe",
              null
          );
      }
      
      Roles rol = rolesRepository.findByName(ERole.CLIENT);
      if(rol == null){
          rol = new Roles();
          rol.setName(ERole.CLIENT);
          rolesRepository.save(rol);
      }
      
      Usuario nuevoUsuario = Usuario.builder()
          .nombre(request.getNombre())
          .apellidos(request.getApellidos())
          .correo(request.getCorreo())
          .telefono(request.getTelefono())
          .contra(passwordEncoder.encode(request.getContra()))
          .status(true)
          .esPensionado(request.isEsPensionado())
          .rol(rol) 
          .build();
      
      usuarioRepository.save(nuevoUsuario);
      
      return ApiResponse.success(
          HttpStatus.CREATED,
          "Usuario creado exitosamente",
          null
      );
      
   } catch(Exception e){
      log.severe("Error creating user: " + e.getMessage());
      return ApiResponse.error(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "No se pudo crear el usuario: " + e.getMessage(),
          null
      );
   }
}

    @Override
    public Usuario getUserForBackend(Long id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No existe el usuario con id: " + id));
    }
}
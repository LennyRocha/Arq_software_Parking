package utez.edu.mx.backendparking.shared.api;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import utez.edu.mx.backendparking.shared.constants.Messages;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja excepciones cuando no se encuentra un recurso (404)
     * Nosotros la lanzamos con:  throw new ResourceNotFoundException("mensaje")
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ApiResponse<?> handleResourceNotFound(ResourceNotFoundException ex) {
        return ApiResponse.error(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    /**
     * Maneja conflictos de datos como duplicados o estados inconsistentes (409)
     * Ejemplo: crear un recurso que ya existe
     * Nosotros la lanzamos con:  throw new ConflictException("mensaje")
     */
    @ExceptionHandler(ConflictException.class)
    public ApiResponse<?> handleConflict(ConflictException ex) {
        return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
    }

    /**
     * Maneja solicitudes mal formadas o inválidas (400)
     * el servidor no pudo procesar una solicitud debido a un error del cliente, como una sintaxis malformada, una solicitud inválida o datos corruptos.
     * La lanzamos con:  throw new BadRequestException("mensaje")
     */
    @ExceptionHandler(BadRequestException.class)
    public ApiResponse<?> handleBadRequest(BadRequestException ex) {
        return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    /**
     * Maneja errores de validación automáticos de Spring Boot
     * NO se debe lanzar manualmente, ocurre automáticamente
     * Ocurre cuando los DTOs no cumplen con las anotaciones @Valid
     * Devuelve un mapa con los campos y sus mensajes de error
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<?> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(
                err -> errors.put(err.getField(), err.getDefaultMessage())
        );
        return ApiResponse.error(HttpStatus.BAD_REQUEST, Messages.ERROR_VALIDATION, errors);
    }

    /**
     * Maneja violaciones de integridad de datos en la base de datos (409)
     *  NO se lanza manualmente, ocurre automáticamente por Spring Data JPA
     * Ocurre automáticamente cuando se violan constraints UNIQUE, FOREIGN KEY, NOT NULL, etc.
     * Ejemplos:
     * - Insertar un registro con email/placa que ya existe (UNIQUE constraint)
     * - Insertar con ID de foreign key que no existe
     * - Violar una restricción NOT NULL
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ApiResponse<?> handleDataIntegrityViolation(DataIntegrityViolationException ex){
        return ApiResponse.error(HttpStatus.CONFLICT, Messages.ERROR_DATA_INTEGRITY, null);
    }

    /**
     * Maneja cualquier excepción no capturada específicamente (500)
     * * NO se debe lanzar manualmente, ocurre automáticamente
     * Es el catch-all para errores inesperados del servidor
     */
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleGenericException(Exception ex) {
        // Log del error para debugging (importante en producción)
        // logger.error("Error interno del servidor: ", ex);
        return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, Messages.ERROR_INTERNAL, null);
    }

}

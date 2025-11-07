package utez.edu.mx.backendparking.modules.vehiculo.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PlacaValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface UniquePlaca {
    String message() default "¡Placa duplicada!. Ya existe un vehículo con esa placa.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String placaField() default "placa";

    String idField() default "id";
}

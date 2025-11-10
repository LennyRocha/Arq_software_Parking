package utez.edu.mx.backendparking.modules.cajon.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = IdentifierValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueIdentifier {
    String message() default "¡Cajón duplicado!. Ya existe un cajón con ese identificador.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String nameField() default "name";

    String idField() default "id";
}

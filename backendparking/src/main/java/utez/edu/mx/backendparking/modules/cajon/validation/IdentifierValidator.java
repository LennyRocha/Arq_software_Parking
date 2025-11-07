package utez.edu.mx.backendparking.modules.cajon.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utez.edu.mx.backendparking.modules.cajon.repository.CajonRepository;

@Component
public class IdentifierValidator implements ConstraintValidator<UniqueIdentifier, Object> {

    @Autowired
    private CajonRepository cajonRepository;

    private String nameField;
    private String idField;

    @Override
    public void initialize(UniqueIdentifier constraintAnnotation) {
        this.nameField = constraintAnnotation.nameField();
        this.idField = constraintAnnotation.idField();
    }

    @Override
    public boolean isValid(Object dto, ConstraintValidatorContext context) {
        String name = (String) new BeanWrapperImpl(dto).getPropertyValue(nameField);
        Long id = (Long) new BeanWrapperImpl(dto).getPropertyValue(idField);

        return !cajonRepository.existsByNameAndIdNot(name, id == null ? -1 : id);
    }
}

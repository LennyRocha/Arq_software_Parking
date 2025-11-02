package utez.edu.mx.backendparking.modules.vehiculo.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utez.edu.mx.backendparking.modules.vehiculo.repository.VehiculoRepository;

@Component
public class PlacaValidator implements ConstraintValidator<UniquePlaca, Object> {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    private String placaField;
    private String idField;

    @Override
    public void initialize(UniquePlaca constraintAnnotation) {
        this.placaField = constraintAnnotation.placaField();
        this.idField = constraintAnnotation.idField();
    }

    @Override
    public boolean isValid(Object dto, ConstraintValidatorContext context) {
        String placa = (String) new BeanWrapperImpl(dto).getPropertyValue(placaField);
        Long id = (Long) new BeanWrapperImpl(dto).getPropertyValue(idField);

        if (placa == null || placa.isEmpty()) {
            return true;
        }

        return !vehiculoRepository.existsByPlacaAndIdNot(placa, id == null ? -1 : id);
    }
}

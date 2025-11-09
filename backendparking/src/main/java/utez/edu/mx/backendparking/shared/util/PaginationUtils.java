package utez.edu.mx.backendparking.shared.util;

import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

public class PaginationUtils {

    /**
     * Convierte parámetros de ordenamiento a objeto Sort de Spring
     * @param sort Array de strings con formato [campo,dirección]
     * @return Objeto Sort configurado
     */
    public static Sort getSortFromParams(String[] sort) {
        if (sort != null && sort.length >= 2) {
            String property = sort[0];
            String direction = sort[1];
            return Sort.by(Sort.Direction.fromString(direction), property);
        }
        return Sort.by(Sort.Direction.DESC, "id");
    }

    /**
     * Convierte parámetros de ordenamiento con campo por defecto personalizable
     * @param sort Array de strings con formato [campo,dirección]
     * @param defaultField Campo por defecto para ordenamiento
     * @param defaultDirection Dirección por defecto
     * @return Objeto Sort configurado
     */
    public static Sort getSortFromParams(String[] sort, String defaultField, Sort.Direction defaultDirection) {
        if (sort != null && sort.length >= 2) {
            String property = sort[0];
            String direction = sort[1];
            return Sort.by(Sort.Direction.fromString(direction), property);
        }
        // Ordenamiento por defecto personalizado
        return Sort.by(defaultDirection, defaultField);
    }

    /**
     * Maneja múltiples criterios de ordenamiento
     * @param sort Array de strings donde cada elemento es "campo,dirección"
     * @return Objeto Sort con múltiples criterios
     */
    public static Sort getMultiSortFromParams(String[] sort) {
        if (sort == null || sort.length == 0) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        List<Sort.Order> orders = new ArrayList<>();

        for (String sortItem : sort) {
            // Manejar el caso por defecto "id,desc"
            if (sortItem.equals("id,desc") && orders.isEmpty()) {
                orders.add(new Sort.Order(Sort.Direction.DESC, "id"));
                continue;
            }

            String[] parts = sortItem.split(",");
            if (parts.length == 2) {
                String property = parts[0];
                String direction = parts[1];
                Sort.Order order = new Sort.Order(Sort.Direction.fromString(direction), property);
                orders.add(order);
            }
        }

        return orders.isEmpty() ? Sort.by(Sort.Direction.DESC, "id") : Sort.by(orders);
    }
}
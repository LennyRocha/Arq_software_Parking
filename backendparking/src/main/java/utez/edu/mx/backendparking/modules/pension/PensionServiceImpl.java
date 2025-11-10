package utez.edu.mx.backendparking.modules.pension;


import jakarta.validation.ConstraintViolationException;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.pension.PensionRepository;
import utez.edu.mx.backendparking.modules.pension.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.dto.PensionResponseDto;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PensionServiceImpl implements PensionService {


    private final PensionRepository pensionRepository;

    public PensionServiceImpl(PensionRepository pensionRepository) {
        this.pensionRepository = pensionRepository;
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public PensionResponseDto create(PensionRequestDto dto) {

        //No puede existir una pensión con la misma combinación de duración (días) y costo.
        if (pensionRepository.existsByDuracionDiasAndCosto(dto.getDuracionDias(), dto.getCosto())) {
            throw new ConflictException(PensionMessages.ERROR_PENSION_DUPLICADA);
        }

        Pension pension = PensionMapper.toEntity(dto);
        pensionRepository.save(pension);

        return PensionMapper.toResponseDto(pension);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public PensionResponseDto update(Long id, PensionRequestDto dto) {
        Pension pension = pensionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PensionMessages.ERROR_PENSION_NOT_FOUND));

        // Verificar si existe otra pensión con la misma combinación de duración y costo (excluyendo la actual)
        if (pensionRepository.existsByDuracionDiasAndCostoAndIdNot(dto.getDuracionDias(), dto.getCosto(), id)) {
            throw new ConflictException(PensionMessages.ERROR_PENSION_DUPLICADA);
        }

        // Actualizar los campos
        pension.setNombre(dto.getNombre());
        pension.setDuracionDias(dto.getDuracionDias());
        pension.setCosto(dto.getCosto());

        pensionRepository.save(pension);

        return PensionMapper.toResponseDto(pension);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public void changeStatus(Long id) {
        Pension pension = pensionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PensionMessages.ERROR_PENSION_NOT_FOUND));

        pension.setStatus(!pension.isStatus());
        pensionRepository.save(pension);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PensionResponseDto> findAll() {
        return pensionRepository.findAll()
                .stream()
                .map(PensionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PensionResponseDto> findAllPensionesPaginados(Pageable pageable, String search) {
        // Definir ordenamiento por defecto (por id) si no viene especificado
        Sort sort = pageable.getSort().isSorted()
                ? pageable.getSort()
                : Sort.by("id").descending();

        PageRequest pageRequest = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        Page<Pension> pensionesPage;

        if (search != null && !search.trim().isEmpty()) {
            // Búsqueda en múltiples campos
            String searchTerm = "%" + search.trim().toLowerCase() + "%";
            pensionesPage = pensionRepository.findBySearchTerm(searchTerm, pageRequest);
        } else {
            // Todas las pensiones sin filtro
            pensionesPage = pensionRepository.findAll(pageRequest);
        }

        return pensionesPage.map(PensionMapper::toResponseDto);
    }

}

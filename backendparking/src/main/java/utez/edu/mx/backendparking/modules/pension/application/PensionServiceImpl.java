package utez.edu.mx.backendparking.modules.pension.application;


import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import utez.edu.mx.backendparking.modules.pension.constant.PensionMessages;
import utez.edu.mx.backendparking.modules.pension.domain.Pension;
import utez.edu.mx.backendparking.modules.pension.domain.PensionRepository;
import utez.edu.mx.backendparking.modules.pension.mapper.PensionMapper;
import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionResponseDto;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PensionServiceImpl implements PensionService {


    private final PensionRepository pensionRepository;

    public PensionServiceImpl(PensionRepository pensionRepository) {
        this.pensionRepository = pensionRepository;
    }

    @Override
    public PensionResponseDto create(PensionRequestDto dto) {

        if (pensionRepository.existsByDuracionDiasAndCosto(dto.getDuracionDias(), dto.getCosto())) {
            throw new ConflictException(PensionMessages.ERROR_PENSION_DUPLICADA);
        }

        Pension pension = PensionMapper.toEntity(dto);
        pensionRepository.save(pension);

        return PensionMapper.toResponseDto(pension);
    }

    //este mego
    @Override
    public List<PensionResponseDto> findAll() {
        return pensionRepository.findAll()
                .stream()
                .map(PensionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void changeStatus(Long id) {
        Pension pension = pensionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PensionMessages.ERROR_PENSION_NOT_FOUND));

        pension.setStatus(!pension.isStatus());
        pensionRepository.save(pension);
    }
}

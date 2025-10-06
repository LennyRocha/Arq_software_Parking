package utez.edu.mx.backendparking.shared.mapper;

public interface BaseMapper<E, ReqDto, ResDto> {

    E toEntity(ReqDto dto);

    ResDto toResponseDto(E entity);
}

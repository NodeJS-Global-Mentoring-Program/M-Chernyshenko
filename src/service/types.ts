export interface IBaseMapper<DTO, Model> {
  toEntity(dto: DTO): Model;
  toDto(entity: Model): DTO;
}

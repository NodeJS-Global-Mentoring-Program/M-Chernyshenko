import { IBaseMapper } from '../../types';
import { GroupDto } from '../types';
import { GroupModel } from '../data-access';

export class GroupMapper implements IBaseMapper<GroupDto, GroupModel> {
  toEntity(dto: GroupDto): GroupModel {
    const { uuid, isDeleted, name } = dto;
    return new GroupModel({
      uuid,
      isDeleted,
      name,
    });
  }
  toDto(entity: GroupModel): GroupDto {
    const { uuid, isDeleted, name } = entity;
    return {
      uuid,
      isDeleted,
      name,
    };
  }
}

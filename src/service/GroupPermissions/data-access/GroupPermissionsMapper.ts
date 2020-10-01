import { IBaseMapper } from '../../types';
import { GroupPermissionDto } from '../types';
import { GroupPermissionModel } from './GroupPermissionsModel';

export class GroupPermissionsMapper
  implements IBaseMapper<GroupPermissionDto, GroupPermissionModel> {
  toEntity(dto: GroupPermissionDto): GroupPermissionModel {
    const { isDeleted, name, uuid } = dto;
    return new GroupPermissionModel({
      isDeleted,
      name,
      uuid,
    });
  }
  toDto(entity: GroupPermissionModel): GroupPermissionDto {
    const { isDeleted, name, uuid } = entity;
    return { isDeleted, name, uuid };
  }
}

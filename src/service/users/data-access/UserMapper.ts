import { IBaseMapper } from '../../types';
import { UserDto } from '../types';
import { SequelizeUserModel } from './SequelizeUserModel';

class UserMapper implements IBaseMapper<UserDto, SequelizeUserModel> {
  toEntity(dto: Required<UserDto>): SequelizeUserModel {
    const { age, isDeleted, login, user_id, password } = dto;
    const entity = new SequelizeUserModel({
      age,
      isDeleted,
      login,
      password,
      user_id,
    });
    return entity;
  }
  toDto(entity: SequelizeUserModel): UserDto {
    const { age, isDeleted, login, user_id } = entity;
    return { age, isDeleted, login, user_id };
  }
}

export { UserMapper };

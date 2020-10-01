import { IBaseMapper } from '../../types';
import { UserDto } from '../types';
import { UserModel } from './UserModel';

class UserMapper implements IBaseMapper<UserDto, UserModel> {
  toEntity(dto: Required<UserDto>): UserModel {
    const { age, isDeleted, login, uuid: user_id, password } = dto;
    const entity = new UserModel({
      age,
      isDeleted,
      login,
      password,
      uuid: user_id,
    });
    return entity;
  }
  toDto(entity: UserModel): UserDto {
    const { age, isDeleted, login, uuid: user_id } = entity;
    return { age, isDeleted, login, uuid: user_id };
  }
}

export { UserMapper };

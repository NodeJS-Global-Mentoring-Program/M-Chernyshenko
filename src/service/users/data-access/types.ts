import { Optional } from 'sequelize/types';
import { UserDto } from '../types';

export interface UserAttributes extends UserDto {
  id: number;
}

export type IUpdateUser = Pick<UserAttributes, 'age' | 'login' | 'password'>;

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
